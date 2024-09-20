import * as React from "react";
import { UserContext } from "./UserProvider";
import { Flex, Text, Avatar } from "@aws-amplify/ui-react";
import Link from "next/link";
import { Schema } from "@/../amplify/data/resource";
import { imgUrl } from "@/utils";

export const CurrentUserChip = (props: object) => {
  const { user } = React.useContext(UserContext);
  return <UserChip {...props} user={user} />;
};

interface UserChipProps {
  user?: Schema["User"]["type"];
}

export const UserChip = ({ user }: UserChipProps) => {
  if (!user) {
    return null;
  }
  return (
    <Flex direction="row" alignItems="center" gap="xs">
      <Avatar src={user.image ? imgUrl(user.image) : undefined} />
      <Text color="font.tertiary" as="span">
        @{user?.username}
      </Text>
    </Flex>
  );
};

export const LinkedUserChip = ({ user }: UserChipProps) => {
  if (!user) {
    return null;
  }

  return (
    <Link href={`/profile/edit`} style={{ textDecoration: "none" }}>
      <UserChip user={user} />
    </Link>
  );
};
