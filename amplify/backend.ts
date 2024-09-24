import * as cdk from "aws-cdk-lib";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { generateImage } from "./functions/generateImage/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  storage,
  generateImage,
});

// Add Cloudfront distro infront of the bucket
const originAccessIdentity = new OriginAccessIdentity(
  backend.storage.resources.bucket.stack,
  "OriginAccessIdentity"
);

backend.storage.resources.bucket.grantRead(originAccessIdentity);

const distro = new Distribution(
  backend.storage.resources.bucket.stack,
  "Distribution",
  {
    defaultBehavior: {
      origin: new S3Origin(backend.storage.resources.bucket, {
        originAccessIdentity,
      }),
    },
  }
);

backend.addOutput({
  custom: {
    cf: cdk.Lazy.string({ produce: () => distro.distributionDomainName }),
  },
});

backend.generateImage.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:*"],
    resources: [
      `arn:aws:bedrock:${
        cdk.Stack.of(backend.data).region
      }::foundation-model/*`,
    ],
  })
);
