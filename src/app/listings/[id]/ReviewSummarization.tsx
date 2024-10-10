import { Button, Message } from "@aws-amplify/ui-react";
import { Listing } from "./page";
import Markdown from "react-markdown";

export const ReviewSummarization = ({
  reviews,
}: {
  reviews: Listing["reviews"];
}) => {
  const data = { summary: null };
  const isLoading = false;
  const generateSummary = async () => {
    // generat summary in here
  };

  return (
    <>
      {data?.summary ? (
        <Message
          variation="outlined"
          colorTheme="info"
          heading="AI-generated summary"
        >
          <Markdown>{data.summary}</Markdown>
        </Message>
      ) : (
        <Button
          isLoading={isLoading}
          loadingText="Generating..."
          onClick={generateSummary}
        >
          Generate Summary
        </Button>
      )}
    </>
  );
};
