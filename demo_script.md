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

Scale back the code
Benefits and who this is for
Amplify AI is the easiest way

- prebuilt ui components
- backed by bedrock
- app developer persona

- greatest way

Give a lot of framing

- here are the use cases

talk about theming

- how to add context to bedrock

build on bedrock
app developer persona
how fast and easy compared to other ways
Don't need to know any IaC
familiar to them (JS/TS)
customers can use this for any size, can be used in production
integrate with any aws service

---

Amplify AI is the easiest way for frontend and fullstack developers to build and scale generative AI apps - we have pre-built UI components, data helpers, and more so developers can build powerful, Bedrock-backed apps in just a few lines of familiar code. Just like Amplify, we are targetting application developers, ones that are familiar and comfortable with TypeScript and React, but not cloud services. With Amplify AI they can build meaningful generative AI experiences in their app with little cloud or AI experience.

We've built the Ampify AI functionality around the use cases we've heard customers talk about the most

- Chatbot to application
- Conversational search: Improve employee productivity by quickly and easily finding accurate information and summarizing content through a conversational interface.
- AI-generated content: Summarization, alt text generation

Amplify AI makes all of this easy.

I'm going to show two short demos, first how to build a chatbot with a beautiful UI, second how to add context to customize your LLM to enable summarization use cases.

The demo app I've built is using Ampify and NextJS to have a full-stack application. I built an example airbnb/vrbo clone

Few lines of code → chatbot with a beautiful UI

Few lines of code → add context to Bedrock (summarization)

Again, Amplify AI builds on the power of Bedrock for the app developer persona, using the programming languages and paradigms those developers are comfortable with to build apps for their companies of all sizes.

Start with type of app we are building

- Drop in chatbot
- Why this is better than chat widgets, customizable and easy to integrate with their code
- Conversational search piece
- Say how it searches through the data
- Summarization - have it pre-built
