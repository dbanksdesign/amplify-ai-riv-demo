import { listingCardTheme } from "./listingCard";
import { headerTheme } from "./header";
import {
  createTheme,
  defaultDarkModeOverride,
} from "@aws-amplify/ui-react/server";

export const theme = createTheme({
  name: "my-theme",
  components: [headerTheme, listingCardTheme],
  overrides: [defaultDarkModeOverride],
});
