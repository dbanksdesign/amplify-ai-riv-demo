import { defineFunction } from "@aws-amplify/backend";

export const getSalesForListing = defineFunction({
  name: "getSalesForListing",
  entry: "./handler.ts",
});
