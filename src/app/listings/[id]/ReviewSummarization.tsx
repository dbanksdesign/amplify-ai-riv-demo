import { Button, Message } from "@aws-amplify/ui-react";
import { Listing } from "./page";
import { useAIGeneration } from "@/client";
import Markdown from "react-markdown";

export const ReviewSummarization = ({
  reviews,
}: {
  reviews: Listing["reviews"];
}) => {
  const [{ data, isLoading }, handleSummary] =
    useAIGeneration("reviewSummarizer");

  const generateSummary = async () => {
    handleSummary({
      reviews: reviews.map((review) => review.text),
    });
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
