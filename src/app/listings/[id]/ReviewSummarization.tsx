import { Button } from "@aws-amplify/ui-react";
import { Listing } from "./page";

export const ReviewSummarization = ({
  reviews,
}: {
  reviews: Listing["reviews"];
}) => {
  const generateSummary = async () => {};

  return (
    <>
      <Button loadingText="Generating..." onClick={generateSummary}>
        Generate Summary
      </Button>
    </>
  );
};
