"use client";
import * as React from "react";
import { Avatar } from "@aws-amplify/ui-react";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { useAIConversation } from "@/client";
import { imgUrl } from "@/utils";
import { ConnectedListingCard } from "@/components/ListingCard";
import { UserContext } from "@/components/UserProvider";

const Chat = () => {
  const { user } = React.useContext(UserContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat");

  return (
    <AIConversation
      isLoading={isLoading}
      avatars={{
        user: {
          avatar: <Avatar src={imgUrl(user?.image ?? "")} />,
          username: user?.username ?? "",
        },
      }}
      messages={messages}
      handleSendMessage={handleSendMessage}
      displayText={{
        getMessageTimestampText: (date) =>
          date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
      }}
      responseComponents={{
        ListingCard: {
          description: "Used to display a rental listing to the user",
          component: ConnectedListingCard,
          props: {
            id: {
              type: "string",
              description: "The id of the listing to display",
            },
          },
        },
      }}
    />
  );
};

export default function SearchPage() {
  return <Chat />;
}
