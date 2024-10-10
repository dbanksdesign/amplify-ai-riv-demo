import * as React from "react";
import { UserContext } from "./UserProvider";
import { Avatar } from "@aws-amplify/ui-react";
import { imgUrl } from "@/utils";

export const UserAvatar = () => {
  const { user } = React.useContext(UserContext);

  return <Avatar src={imgUrl(user?.image ?? "")} />;
};
