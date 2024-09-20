import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { getWeather } from "../functions/getWeather/resource";
import { getSalesForListing } from "../functions/getSales/resource";

const schema = a.schema({
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

  User: a
    .model({
      username: a.string(),
      listings: a.hasMany("Listing", "hostId"),
      reviews: a.hasMany("Review", "reviewerId"),
      summaries: a.hasMany("ReviewSummary", "requesterId"),
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
      summaries: a.hasMany("ReviewSummary", "listingId"),
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
  ReviewSummary: a
    .model({
      requester: a.belongsTo("User", "requesterId"),
      requesterId: a.id(),
      listing: a.belongsTo("Listing", "listingId"),
      listingId: a.id(),
      summary: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  reviewSummarizer: a
    .generation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: `You are a helpful assistant that summarizes reviews. Give a concise summary of the supplied reviews. The summary should be between 20 and 200 characters.`,
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

  getSalesForListing: a
    .query()
    .arguments({
      listingId: a.string(),
    })
    .returns(
      a.customType({
        sales: a.float(),
      })
    )
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(getSalesForListing)),

  chat: a.conversation({
    aiModel: a.ai.model("Claude 3.5 Sonnet"),
    systemPrompt: `You are a helpful assistant for a vacation home rental application. If you use a tool, tell the user you are using a tool. When possible, respond with a UI tool which will display custom UI to the user.`,
    tools: [
      {
        description: `Used to list and search for rental listings`,
        query: a.ref("listListings"),
      },
      {
        description: `Used to get the current weather of a city`,
        query: a.ref("getWeather"),
      },
      {
        description: `Used to get the sales for a listing`,
        query: a.ref("getSalesForListing"),
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
