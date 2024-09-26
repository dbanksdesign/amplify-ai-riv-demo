import {
  ConversationTurnEvent,
  handleConversationTurnEvent,
} from "@aws-amplify/backend-ai/conversation/runtime";

/**
 * Handler with simple tool.
 */
export const handler = async (event: ConversationTurnEvent) => {
  console.log(JSON.stringify(event, null, 2));
  console.log(JSON.stringify(process.env, null, 2));

  await handleConversationTurnEvent(event, {
    tools: [],
  });
};
