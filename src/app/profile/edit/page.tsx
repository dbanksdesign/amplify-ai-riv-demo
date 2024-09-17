'use client';
import * as React from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/../amplify/data/resource";
import {
  Button,
  DropZone,
  Flex,
  Loader,
  Placeholder,
  TextField,
} from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { Image } from "@/components/Image";
import { customToast, getFormDataFromEvent } from "@/utils";
import { useParams } from "next/navigation";
import { UserContext } from "@/components/UserProvider";

const client = generateClient<Schema>({
  authMode: "userPool",
});

const UserForm = ({ user }: { user: Schema["User"]["type"] }) => {
  console.log({ user });
  const [img, setImg] = React.useState(user?.image);
  const [isUploading, setIsUploading] = React.useState(false);

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
        onDropComplete={({ acceptedFiles, rejectedFiles }) => {
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
            {isUploading ? (
              <Flex
                position="absolute"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
                backgroundColor="overlay.20"
              >
                <Loader position="absolute" size="large" />
              </Flex>
            ) : null}
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
  const {user} = React.useContext(UserContext);

  return (
    <Flex direction="column" padding="xl">
      {user ? <UserForm user={user} /> : null}
    </Flex>
  );
}
