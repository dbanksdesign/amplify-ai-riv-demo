"use client";
import * as React from "react";
import { useAIConversation } from "@/client";
import { AIConversation } from "@aws-amplify/ui-react-ai";

export default function Home() {
  // const [{ data, isLoading }, generateReviewSummary] =
  //   useAIGeneration("reviewSummarizer");
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation("chat");

  const handleSendMessage = (input: any) => {
    sendMessage({
      ...input,
      aiContext: {
        current_listings: "5",
        // instructions: "Talk like a pirate",
      },
    });
  };

  // React.useEffect(() => {
  //   handleSendMessage({
  //     content: [{ text: "How many new comments do I have?" }],
  //     aiContext: {
  //       newComments: 5,
  //       newBookings: 1,
  //     },
  //   });
  // }, [handleSendMessage]);

  return (
    <div>
      <AIConversation
        messages={messages}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        // responseComponents={{
        //   SalesChart: {
        //     component: Chart,
        //     description:
        //       "UI component used to show the user sales date over time periods",
        //     props: {
        //       timeperiod: { type: "string" },
        //     },
        //   },
        //   UpdateListingDescription: {
        //     component: UpdateListingDescription,
        //     description:
        //       "UI component used to update the description of a listing",
        //     props: {
        //       listingId: {
        //         type: "string",
        //         description: "the id of the listing",
        //       },
        //       defaultValue: {
        //         type: "string",
        //         description:
        //           "the default value for the description of the listing",
        //       },
        //     },
        //   },
        // }}
      />
      {/* <Button
        onClick={async () => {
          generateReviewSummary({
            reviews: [
              "this place sucks",
              "it smelled bad",
              "the parking was excellent, but the bedding left much to be desired",
            ],
          });
        }}
      >
        Generate
      </Button>
      <div>{data?.summary}</div> */}
      {/* <UpdateListingDescription listingId="1" defaultValue="Hello" /> */}
    </div>
  );
}
