import * as React from "react";
import { Button, Flex, TextAreaField } from "@aws-amplify/ui-react";
import { Rating } from "@mantine/core";
import { customToast, getFormDataFromEvent } from "@/utils";
import { UserContext } from "@/components/UserProvider";
import { client } from "@/client";

interface ReviewFormInterface {
  id: string;
}

export const ReviewForm = ({ id }: ReviewFormInterface) => {
  const [score, setScore] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { user } = React.useContext(UserContext);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = getFormDataFromEvent(event);
    if (user) {
      setLoading(true);
      client.models.Review.create({
        listingId: id,
        text: data.text as string,
        score,
        reviewerId: user.id,
      }).then(() => {
        customToast({
          colorTheme: "success",
          heading: "Review added!",
        });
        setLoading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setScore(0);
      });
    }
  };
  return (
    <Flex direction="column" as="form" onSubmit={handleSubmit}>
      <Rating value={score} onChange={setScore} />
      <TextAreaField
        ref={inputRef}
        label="comment"
        name="text"
        labelHidden
        placeholder=""
      />
      <Button type="submit" variation="primary" isLoading={loading}>
        Submit
      </Button>
    </Flex>
  );
};
