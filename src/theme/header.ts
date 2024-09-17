import { defineComponentTheme } from "@aws-amplify/ui-react/server";

export const headerTheme = defineComponentTheme({
  name: "app-header",
  theme: (tokens) => {
    return {
      paddingInline: tokens.space.large,
      paddingBlock: tokens.space.small,
      boxShadow: `${tokens.shadows.medium}`,
      borderWidth: 0,
      borderBottomWidth: tokens.borderWidths.small,
      borderStyle: "solid",
      borderColor: tokens.colors.border.primary,
      zIndex: 99,
    };
  },
});
