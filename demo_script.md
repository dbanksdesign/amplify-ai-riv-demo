Intro about Amplify AI
Show the current app state:

- Amplify Gen 2 app: auth, data, storage (custom CDK code too)
- NextJS
- Amplify React components

Talk about how we think about GenAI as part of data
Mention seeing a pattern

Add generation route (reviewSummarizer)

Show off intellisense for ai model selection
Mention uses Converse API
Arguments
Returns
Authorization

```ts
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
```

Go over to our Amplify client and create our AI hooks

```ts
export const { useAIConversation, useAIGeneration } = createAIHooks(client);
```

Now to use this in our React code

```tsx
import { Button, Message } from "@aws-amplify/ui-react";
import { Listing } from "./page";
import { useAIGeneration } from "@/client";
import Markdown from "react-markdown";

export const ReviewSummarization = ({
  reviews,
}: {
  reviews: Listing["reviews"];
}) => {
  const [{ data, isLoading }, handleSummary] =
    useAIGeneration("reviewSummarizer");

  const generateSummary = async () => {
    handleSummary({
      reviews: reviews.map((review) => review.text),
    });
  };

  return (
    <>
      {data?.summary ? (
        <Message
          variation="outlined"
          colorTheme="info"
          heading="AI-generated summary"
        >
          <Markdown>{data.summary}</Markdown>
        </Message>
      ) : (
        <Button
          isLoading={isLoading}
          loadingText="Generating..."
          onClick={generateSummary}
        >
          Generate Summary
        </Button>
      )}
    </>
  );
};
```

Now onto something a little more complicated
conversation route

```ts
  chat: a.conversation({
    aiModel: a.ai.model("Claude 3.5 Sonnet"),
    systemPrompt: `You are a helpful assistant.`,
    tools: [
      {
        description: `Used to list rental listings`,
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
```

Conversation routes keep message history and conversations can be queried?
LLM tools are schema queries
You can list records of a data model
Or write custom queries that are lambdas or an AppSync resolver
The owner-based authorization is passed through the tools/queries so users don't accidentally get more data than they should

Now go over to React code
We have also built a simple, but flexible chat component to go along with our AI conversation routes

```tsx
const { user } = React.useContext(UserContext);
const [
  {
    data: { messages },
    isLoading,
  },
  handleSendMessage,
] = useAIConversation("chat");

return (
  <AIConversation
    isLoading={isLoading}
    avatars={{
      user: {
        avatar: <Avatar src={imgUrl(user?.image ?? "")} />,
        username: user?.username ?? "",
      },
    }}
    messages={messages}
    handleSendMessage={handleSendMessage}
    displayText={{
      getMessageTimestampText: (date) =>
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
    }}
    responseComponents={{
      ListingCard: {
        description: "Used to display a rental listing to the user",
        component: ConnectedListingCard,
        props: {
          id: {
            type: "string",
            description: "The id of the listing to display",
          },
        },
      },
    }}
  />
);
```

```ts
date.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
}),
```

---

## TODO

- Make a new theme
- Add more listings
- Add more reviews

---

## Notes

- Could we do something with user groups?
- hosts user group could have a special chatbot that is specific to hosts
- could the experience start before the user types anything? like show recent comments/bookings
- or ones that need attention?

- is there anything we can show that has multiple conversation
- routes? Could a conversation route use other conversation routes?
- see the current bookings?
- update the description of a rental
- could we have a separate conversation route that is specific to a workflow/page?
