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
import { client, useAIGeneration } from "@/client";
import { uploadData } from "aws-amplify/storage";

export default function CreateListingPage() {
  const [images, setImages] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");
  const [generatedImgs, setGeneratedImgs] = React.useState<string[]>([]);

  const [{ data: generatedListing, isLoading }, handleGenerateListing] =
    useAIGeneration("generateListing");

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

  const generateListing = async () => {
    handleGenerateListing({
      description,
    });
    Promise.all([
      client.queries.generateImage({
        prompt: description,
      }),
      client.queries.generateImage({
        prompt: description,
      }),
      client.queries.generateImage({
        prompt: description,
      }),
    ]).then((results) => {
      console.log({ results });
      const imgs = results
        .map((result) => {
          return result?.data?.[0] ?? "";
        })
        .filter((img) => img.length);
      setGeneratedImgs(imgs);
    });
  };

  return (
    <Flex direction="column">
      <Flex direction="row" padding="xl" alignItems="flex-end">
        <TextAreaField
          flex="1"
          autoResize
          label="AI generated listing"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <Button
          variation="primary"
          isLoading={isLoading}
          onClick={generateListing}
        >
          Generate Listing
        </Button>
      </Flex>
      <Flex direction="row">
        <Flex
          padding="large"
          as="form"
          direction="column"
          onSubmit={handleSubmit}
        >
          <TextField
            label="title"
            name="title"
            defaultValue={generatedListing?.title ?? ""}
          />
          <TextAreaField
            label="description"
            name="description"
            defaultValue={generatedListing?.description ?? ""}
          />
          <Flex direction="row">
            <StepperField
              label="Number of bedrooms"
              name="numBedrooms"
              defaultValue={generatedListing?.numBathrooms ?? 1}
            />
            <StepperField
              label="Number of bathrooms"
              name="numBathrooms"
              defaultValue={generatedListing?.numBathrooms ?? 1}
            />
          </Flex>
          <TextField
            type="number"
            label="Price"
            name="price"
            defaultValue={generatedListing?.price ?? 100}
            innerStartComponent={
              <Flex alignItems="center" height="100%" padding="small">
                $
              </Flex>
            }
          />

          <TextField
            type="number"
            label="Sleeps"
            name="sleeps"
            defaultValue={generatedListing?.sleeps ?? 1}
          />

          <TextField
            type="number"
            label="Square Feet"
            name="sqft"
            defaultValue={generatedListing?.sqft ?? 100}
          />

          <TextAreaField
            label="Amenities"
            name="amenities"
            defaultValue={generatedListing?.amenities ?? ""}
          />

          <TextField
            label="City"
            name="city"
            // defaultValue={generatedListing?.city ?? ""}
          />
          <TextField
            label="Type"
            name="type"
            defaultValue={generatedListing?.type ?? ""}
          />

          <Button type="submit" variation="primary">
            Submit
          </Button>
        </Flex>
        <View flex="1" padding="large">
          <Text>Images</Text>
          {generatedImgs.map((img) => {
            return <img src={`data:image/jpeg;base64,${img}`} />;
          })}
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
    </Flex>
  );
}
