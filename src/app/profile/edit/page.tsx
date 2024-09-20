"use client";
import * as React from "react";
import { Schema } from "@/../amplify/data/resource";
import { Button, DropZone, Flex, TextField } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { Image } from "@/components/Image";
import { customToast, getFormDataFromEvent } from "@/utils";
import { UserContext } from "@/components/UserProvider";
import { client } from "@/client";

const UserForm = ({ user }: { user: Schema["User"]["type"] }) => {
  console.log({ user });
  const [img, setImg] = React.useState(user?.image);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = getFormDataFromEvent(event);
    client.models.User.update({
      id: user.id,
      username: data.username as string,
      image: img,
    }).then(() => {
      customToast({ colorTheme: "success", heading: "Updated" });
    });
  };

  return (
    <Flex direction="column" as="form" onSubmit={handleSubmit}>
      <TextField
        label="Username"
        name="username"
        defaultValue={user.username ?? ""}
      />
      <DropZone
        flex="1"
        onDropComplete={({ acceptedFiles }) => {
          const file = acceptedFiles[0];
          if (file) {
            uploadData({
              key: `${user.id}/${file.name}`,
              data: file,
            }).result.then((item) => {
              setImg(`public/${item.key}`);
            });
          }
        }}
      >
        {img ? (
          <Flex justifyContent="center" flex="1" position="relative">
            <Image src={img} alt="" />
          </Flex>
        ) : (
          "Drag image here"
        )}
      </DropZone>
      <Button type="submit">Submit</Button>
    </Flex>
  );
};

export default function UserPage() {
  const { user } = React.useContext(UserContext);

  return (
    <Flex direction="column" padding="xl">
      {user ? <UserForm user={user} /> : null}
    </Flex>
  );
}
