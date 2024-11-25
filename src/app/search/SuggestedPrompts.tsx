import { Flex, Text } from "@aws-amplify/ui-react";
import { LuFlower2, LuHotel, LuPalmtree } from "react-icons/lu";

export const BeachPrompt = () => {
  return (
    <Flex direction="column" alignItems="center" gap="xs">
      <LuPalmtree />
      <Text>Beachfront</Text>
    </Flex>
  );
};

export const GardenPrompt = () => {
  return (
    <Flex direction="column" alignItems="center" gap="xs">
      <LuFlower2 />
      <Text>Garden</Text>
    </Flex>
  );
};

export const HotelPrompt = () => {
  return (
    <Flex direction="column" alignItems="center" gap="xs">
      <LuHotel />
      <Text>Hotel</Text>
    </Flex>
  );
};
