import { defineFunction, secret } from "@aws-amplify/backend";

export const getWeather = defineFunction({
  name: "getWeather",
  entry: "./handler.ts",
  environment: {
    WEATHERSTACK_API_KEY: secret("WEATHERSTACK_API_KEY"),
  },
});
