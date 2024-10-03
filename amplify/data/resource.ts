import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { getWeather } from "../functions/getWeather/resource";
import { generateImage } from "../functions/generateImage/resource";

const schema = a.schema({
  // Data Models
  User: a
    .model({
      username: a.string(),
      listings: a.hasMany("Listing", "hostId"),
      reviews: a.hasMany("Review", "reviewerId"),
      reservations: a.hasMany("Reservation", "userId"),
      location: a.string(),
      identityId: a.string(),
      image: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.publicApiKey().to(["read"]),
    ]),
  Reservation: a
    .model({
      userId: a.id(),
      user: a.belongsTo("User", "userId"),
      listingId: a.id(),
      listing: a.belongsTo("Listing", "listingId"),
      startDate: a.date(),
      endDate: a.date(),
    })
    .authorization((allow) => [allow.owner()]),
  Listing: a
    .model({
      title: a.string(),
      description: a.string(),
      amenities: a.string(),
      numBedrooms: a.integer(),
      bedrooms: a.string().array(),
      numBathrooms: a.integer(),
      images: a.string().array(),
      type: a.string(),
      sleeps: a.integer(),
      sqft: a.integer(),
      reviews: a.hasMany("Review", "listingId"),
      reservations: a.hasMany("Reservation", "listingId"),
      host: a.belongsTo("User", "hostId"),
      hostId: a.id(),
      price: a.float(),
      city: a.string(),
      state: a.string(),
      zip: a.string(),
    })
    .authorization((allow) => [allow.owner(), allow.publicApiKey()]),
  Review: a
    .model({
      listing: a.belongsTo("Listing", "listingId"),
      listingId: a.id(),
      reviewer: a.belongsTo("User", "reviewerId"),
      reviewerId: a.id(),
      date: a.date(),
      text: a.string(),
      score: a.integer(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.publicApiKey().to(["read"]),
    ]),

  // Custom Queries
  getWeather: a
    .query()
    .arguments({ city: a.string() })
    .returns(
      a.customType({
        temperature: a.float(),
        weatherCode: a.integer(),
      })
    )
    .authorization((allow) => allow.authenticated())
    .handler(a.handler.function(getWeather)),
  generateImage: a
    .query()
    .arguments({
      prompt: a.string(),
    })
    .returns(a.string().array())
    .handler(a.handler.function(generateImage))
    .authorization((allow) => [allow.authenticated()]),

  // Generation routes
  generateListing: a
    .generation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: `You are a helpful assistant that generates rental listing information based on a description. Please fill out the information as best as you can. Using the description provided create a catchy title, a bulleted list for amenities, and a longform description between 20 and 200 words. Make up information if none is provided.`,
      inferenceConfiguration: {
        temperature: 0.7,
        topP: 1,
        maxTokens: 4000,
      },
    })
    .arguments({
      description: a.string(),
    })
    .returns(
      a.customType({
        title: a.string(),
        description: a.string(),
        amenities: a.string(),
        numBedrooms: a.integer(),
        numBathrooms: a.integer(),
        type: a.string(),
        sleeps: a.integer(),
        sqft: a.integer(),
        price: a.integer(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),

  reviewSummarizer: a
    .generation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: `You are a helpful assistant that summarizes reviews. Give a concise summary of the supplied reviews. The summary should be between 20 and 200 characters.`,
      inferenceConfiguration: {
        temperature: 0.2,
        maxTokens: 100,
      },
    })
    .arguments({
      reviews: a.string().array(),
    })
    .returns(
      a.customType({
        summary: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),

  // Conversation routes
  chat: a.conversation({
    aiModel: a.ai.model("Claude 3.5 Sonnet"),
    systemPrompt: `You are a helpful assistant for a vacation home rental booking application.`,
    tools: [
      {
        description: "Used to get the current weather of a city",
        query: a.ref("getWeather"),
      },
      {
        description: `Used to list rental listings`,
        query: a.ref("listListings"),
      },
    ],
  }),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 90,
    },
  },
});
