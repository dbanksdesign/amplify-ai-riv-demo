import { listingCardTheme } from "./listingCard";
import { headerTheme } from "./header";
import {
  createTheme,
  defaultDarkModeOverride,
} from "@aws-amplify/ui-react/server";
import { cardTheme } from "./card";

export const theme = createTheme({
  name: "my-theme",
  primaryColor: "purple",
  tokens: {
    radii: {
      small: "2rem",
      medium: "1rem",
      large: "0.5rem",
    },
    colors: {
      border: {
        primary: "{colors.neutral.40}",
        secondary: "{colors.neutral.20}",
        tertiary: "{colors.neutral.10}",
      },
    },
  },
  components: [headerTheme, listingCardTheme, cardTheme],
  overrides: [defaultDarkModeOverride],
});
