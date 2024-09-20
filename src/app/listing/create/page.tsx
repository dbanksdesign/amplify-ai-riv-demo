"use client";
import * as React from "react";
import {
  Flex,
  TextField,
  TextAreaField,
  Button,
  StepperField,
  View,
  Text,
} from "@aws-amplify/ui-react";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import { customToast, getFormDataFromEvent } from "@/utils";
import { UserContext } from "@/components/UserProvider";
import { useRouter } from "next/navigation";
import { client } from "@/client";

export default function CreateListingPage() {
  const [images, setImages] = React.useState<string[]>([]);
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = getFormDataFromEvent(event);
    client.models.Listing.create({
      title: data.title as string,
      type: data.type as string,
      city: data.city as string,
      description: data.description as string,
      numBedrooms: parseInt(data.numBedrooms as string),
      numBathrooms: parseInt(data.numBathrooms as string),
      price: parseFloat(data.price as string),
      images: images.map((image) => `protected/${user?.identityId}/${image}`),
      amenities: data.amenities as string,
    }).then(() => {
      customToast({
        colorTheme: "success",
        variation: "filled",
        heading: "Saved!",
      });
      router.push("/");
    });
  };

  return (
    <Flex direction="row">
      <Flex
        padding="large"
        as="form"
        direction="column"
        onSubmit={handleSubmit}
      >
        <TextField label="title" name="title" />
        <TextAreaField label="description" name="description" />
        <Flex direction="row">
          <StepperField
            label="Number of bedrooms"
            name="numBedrooms"
            defaultValue={1}
          />
          <StepperField
            label="Number of bathrooms"
            name="numBathrooms"
            defaultValue={1}
          />
        </Flex>
        <TextField
          type="number"
          label="Price"
          name="price"
          innerStartComponent={<>$</>}
        />

        <TextAreaField label="Amenities" name="amenities" />

        <TextField label="City" name="city" />
        <TextField label="Type" name="type" />

        <Button type="submit" variation="primary">
          Submit
        </Button>
      </Flex>
      <View flex="1" padding="large">
        <Text>Images</Text>
        <StorageManager
          acceptedFileTypes={["*"]}
          accessLevel="protected"
          maxFileCount={50}
          onFileRemove={({ key }) => {
            setImages((value) => value.filter((image) => image !== key));
          }}
          onUploadSuccess={({ key }) => {
            setImages((prevImages) => [`${key}`, ...prevImages]);
          }}
        />
      </View>
    </Flex>
  );
}
