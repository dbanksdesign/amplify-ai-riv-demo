import { Button, Message } from "@aws-amplify/ui-react";
import { Listing } from "./page";
import Markdown from "react-markdown";
import { useAIGeneration } from "@/client";

export const ReviewSummarization = ({
  reviews,
}: {
  reviews: Listing["reviews"];
}) => {
  const [{ data, isLoading }, handleGenerateSummary] =
    useAIGeneration("reviewSummarizer");

  const generateSummary = async () => {
    handleGenerateSummary({ reviews: reviews.map((review) => review.text) });
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
