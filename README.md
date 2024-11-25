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
