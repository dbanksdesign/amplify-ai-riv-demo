import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { getWeather } from "../functions/getWeather/resource";

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
        weatherDescriptions: a.string().array(),
        windSpeed: a.integer(),
      })
    )
    .authorization((allow) => allow.authenticated())
    .handler(a.handler.function(getWeather)),

  reviewSummarizer: a
    .generation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt: `
    You are a helpful assistant that summarizes reviews.
    Provide a concise summary of the reviews provided.
    Summaries should be between 20 and 200 characters.
    `,
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
  chat: a
    .conversation({
      aiModel: a.ai.model("Claude 3.5 Haiku"),
      systemPrompt: `
    You are a helpful assistant to a home rental booking app.
    `,
      tools: [
        a.ai.dataTool({
          model: a.ref("Listing"),
          modelOperation: "list",
          name: "SearchListing",
          description: "Used to search for rental listings",
        }),
        a.ai.dataTool({
          query: a.ref("getWeather"),
          name: "GetWeather",
          description: "Used to get the weather for a city.",
        }),
      ],
    })
    .authorization((allow) => allow.owner()),
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
