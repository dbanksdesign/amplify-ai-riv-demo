import { Flex, Text } from "@aws-amplify/ui-react";
import { Schema } from "@/../amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";
import { Rating } from "@mantine/core";

const selectionSet = [
  "reviewer.username",
  "reviewer.id",
  "text",
  "createdAt",
  "score",
] as const;

interface ReviewProps {
  review: SelectionSet<Schema["Review"]["type"], typeof selectionSet>;
}

const options: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};

export const Review = ({ review }: ReviewProps) => {
  return (
    <Flex direction="column">
      <Flex direction="row">
        {/* Hiding username because its all me */}
        {/* <Text>{review.reviewer?.username}</Text> */}
        <Text>
          {new Date(review.createdAt).toLocaleString("en-US", options)}
        </Text>
      </Flex>
      <Rating readOnly value={review.score ?? 0} />
      <Text>{review.text}</Text>
    </Flex>
  );
};
