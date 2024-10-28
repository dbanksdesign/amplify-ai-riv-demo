"use client";
import * as React from "react";
import { useAIConversation } from "@/client";
import { AIConversation } from "@aws-amplify/ui-react-ai";
import { ConnectedListingCard } from "@/components/ListingCard";
import { UserAvatar } from "@/components/UserAvatar";
import { UserContext } from "@/components/UserProvider";

export const Chat = ({ id }: { id: string }) => {
  const { user } = React.useContext(UserContext);
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation("chat", {
    id,
  });

  console.log(messages);

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={handleSendMessage}
      avatars={{
        user: {
          avatar: <UserAvatar />,
          username: user?.username ?? "",
        },
      }}
      allowAttachments
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
