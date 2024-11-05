import * as React from "react";
import { Button, Message } from "@aws-amplify/ui-react";
import Markdown from "react-markdown";

interface SummaryData {
  summary?: string;
}

export const ReviewSummarization = ({
  reviews,
}: {
  reviews: string[];
}) => {
  const [data, setData] = React.useState<SummaryData>();
  const [isLoading, setIsLoading] = React.useState(false);

  const generateSummary = async () => {
    setData({ summary: "testing" });
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
