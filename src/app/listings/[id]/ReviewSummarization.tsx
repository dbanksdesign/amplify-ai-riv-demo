import { Button } from "@aws-amplify/ui-react";
import { Listing } from "./page";

export const ReviewSummarization = ({
  reviews,
}: {
  reviews: Listing["reviews"];
}) => {
  const generateSummary = async () => {
    // Call the API to generate a summary based on the reviews
    console.log("Generating summary...");
  };

  return (
    <>
      <Button
        isLoading={false}
        loadingText="Generating..."
        onClick={generateSummary}
      >
        Generate Summary
      </Button>
    </>
  );
};
