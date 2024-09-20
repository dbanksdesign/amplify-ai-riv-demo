import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Schema } from "../amplify/data/resource";

export const client = generateClient<Schema>({ authMode: "userPool" });
export const { useAIConversation, useAIGeneration } = createAIHooks(client);
