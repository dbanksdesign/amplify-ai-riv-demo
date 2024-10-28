import * as React from "react";
import { Button, Message } from "@aws-amplify/ui-react";
import { Listing } from "./page";
import Markdown from "react-markdown";
import { useAIGeneration } from "@/client";

interface SummaryData {
  summary?: string;
}

export const ReviewSummarization = ({
  reviews,
}: {
  reviews: Listing["reviews"];
}) => {
  const [{ data, isLoading }, handleReviewSummary] =
    useAIGeneration("reviewSummarizer");

  const generateSummary = async () => {
    handleReviewSummary({
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
