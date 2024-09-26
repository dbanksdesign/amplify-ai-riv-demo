import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { defineConversationHandlerFunction } from "@aws-amplify/backend-ai/conversation";

export const myCustomConversationHandler = defineConversationHandlerFunction({
  name: "customConversationHandlerFunction",
  entry: "./custom-handler.ts",
  models: [
    {
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      region: "us-west-2",
    },
  ],
});

const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model("Claude 3 Haiku"),
    systemPrompt: `Talk like a pirate`,
    handler: myCustomConversationHandler,
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
