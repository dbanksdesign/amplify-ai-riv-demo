import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { Schema } from "../../data/resource";

export const handler: Schema["generateImage"]["functionHandler"] = async (
  event
) => {
  const client = new BedrockRuntimeClient({ region: "us-west-2" });
  const res = await client.send(
    new InvokeModelCommand({
      modelId: "stability.stable-image-core-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: event.arguments.prompt,
        mode: "text-to-image",
        aspect_ratio: "1:1",
        output_format: "jpeg",
      }),
    })
  );

  const jsonString = new TextDecoder().decode(res.body);
  console.log({ jsonString });
  const output = JSON.parse(jsonString);

  return output.images;
};
