import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, myCustomConversationHandler } from "./data/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  myCustomConversationHandler,
});
