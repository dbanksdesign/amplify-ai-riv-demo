import { defineFunction } from "@aws-amplify/backend";

export const generateImage = defineFunction({
  name: "generateImage",
  entry: "./handler.ts",
  timeoutSeconds: 500,
});
