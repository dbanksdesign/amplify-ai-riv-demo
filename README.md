```ts
  reviewSummarizer: a
    .generation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: `
      You are a helpful assistant that summarizes reviews.
      Give a concise summary of the supplied reviews.
      The summary should be between 20 and 200 characters.
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
```

```ts
const dataTools = [
  {
    name: "listListings",
    description: "Used to search for and list rental Listings",
    inputSchema: {
      json: {
        type: "object",
        properties: {
          filter: {
            type: "object",
            properties: {
              description: {
                type: "object",
                properties: {
                  contains: {
                    type: "string",
                  },
                },
              },
              title: {
                type: "object",
                properties: {
                  contains: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        required: [],
      },
    },
    graphqlRequestInputDescriptor: {
      selectionSet:
        "items { title description amenities numBedrooms bedrooms numBathrooms images type sleeps sqft reviews { items { listingId reviewer { username reservations { items { userId listingId startDate endDate id createdAt updatedAt owner } nextToken } location identityId image id createdAt updatedAt owner } reviewerId date text score id createdAt updatedAt owner } nextToken } reservations { items { userId user { username reviews { items { listingId reviewerId date text score id createdAt updatedAt owner } nextToken } location identityId image id createdAt updatedAt owner } listingId startDate endDate id createdAt updatedAt owner } nextToken } host { username reviews { items { listingId reviewerId date text score id createdAt updatedAt owner } nextToken } reservations { items { userId listingId startDate endDate id createdAt updatedAt owner } nextToken } location identityId image id createdAt updatedAt owner } hostId price city state zip id createdAt updatedAt owner } nextToken",
      propertyTypes: {
        filter: "ModelListingFilterInput",
      },
      queryName: "listListings",
    },
  },
  {
    name: "getListing",
    description: "Used to get a rental listing by ID",
    inputSchema: {
      json: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description:
              "A unique identifier for an object. This scalar is serialized like a String but isn't meant to be human-readable.",
          },
        },
        required: ["id"],
      },
    },
    graphqlRequestInputDescriptor: {
      selectionSet:
        "title description amenities numBedrooms bedrooms numBathrooms images type sleeps sqft reviews { items { listingId reviewer { username listings { nextToken } reservations { items { userId listingId startDate endDate id createdAt updatedAt owner } nextToken } location identityId image id createdAt updatedAt owner } reviewerId date text score id createdAt updatedAt owner } nextToken } reservations { items { userId user { username listings { nextToken } reviews { items { listingId reviewerId date text score id createdAt updatedAt owner } nextToken } location identityId image id createdAt updatedAt owner } listingId startDate endDate id createdAt updatedAt owner } nextToken } host { username listings { nextToken } reviews { items { listingId reviewerId date text score id createdAt updatedAt owner } nextToken } reservations { items { userId listingId startDate endDate id createdAt updatedAt owner } nextToken } location identityId image id createdAt updatedAt owner } hostId price city state zip id createdAt updatedAt owner",
      propertyTypes: { id: "ID!" },
      queryName: "getListing",
    },
  },
];
```

```ts
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
    You are a helpful assistant for a vacation home rental app.
    When you use a tool or UI component don't tell the user the name of the tool.
    `,
      tools: [
        a.ai.dataTool({
          model: a.ref("Listing"),
          modelOperation: "list",
          description:
            "Used to search for rental listing records. Filtering based on string values using `contains` and `eq` will are case sensitive. Where appropriate, use combinations of `and` and `or` to ensure items are found. Do not use the `limit` field.",
          name: "SearchListings",
        }),
        a.ai.dataTool({
          query: a.ref("getWeather"),
          description: "Gets the weather for a city",
          name: "GetWeather",
        }),
        a.ai.dataTool({
          query: a.ref("knowledgeBase"),
          description: "Gets information about the application",
          name: "GetInformation",
        }),
      ],
    })
    .authorization((allow) => allow.owner()),

  knowledgeBase: a
    .query()
    .arguments({
      input: a.string(),
    })
    .handler(
      a.handler.custom({
        entry: "./kbResolver.js",
        dataSource: "knowledgeBase",
      })
    )
    .returns(a.string())
    .authorization((allow) => allow.authenticated()),
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
```

```js
export function request(ctx) {
  const { input } = ctx.args;
  return {
    resourcePath: "/knowledgebases/XXXXXX/retrieve",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        retrievalQuery: {
          text: input,
        },
      }),
    },
  };
}

export function response(ctx) {
  return JSON.stringify(ctx.result.body);
}
```

```tsx
"use client";
import * as React from "react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import ReactMarkdown from "react-markdown";

import { useAIConversation } from "@/client";
import { AIContext } from "@/components/AIContext";
import { BookingCard } from "@/components/BookingCard";
import { ConnectedListingCard } from "@/components/ListingCard";
import { UserAvatar } from "@/components/UserAvatar";
import { UserContext } from "@/components/UserProvider";

export default function SearchPage() {
  const { user } = React.useContext(UserContext);
  const aiContext = React.useContext(AIContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat");
  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      aiContext={() => aiContext.data}
      handleSendMessage={handleSendMessage}
      allowAttachments
      avatars={{
        user: {
          avatar: <UserAvatar />,
          username: user?.username ?? "",
        },
      }}
      messageRenderer={{
        text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>,
      }}
      responseComponents={{
        ListingCard: {
          description: "used to display a rental listing to the user",
          component: ConnectedListingCard,
          props: {
            id: {
              type: "string",
              description: "The id of the listing to display",
            },
          },
        },
        BookingCard: {
          component: BookingCard,
          description: "UI component that lets users book a rental listing",
          props: {
            id: {
              type: "string",
              description: "ID of the listing",
            },
          },
        },
      }}
    />
  );
}
```
