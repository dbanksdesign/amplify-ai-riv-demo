import { defineComponentTheme } from "@aws-amplify/ui-react/server";

export const cardTheme = defineComponentTheme({
  name: "card",
  theme: (tokens) => {
    return {
      _vars: {
        "shadow-color": "0deg 0% 0%",
      },
      borderRadius: tokens.radii.large,
      padding: tokens.space.large,
      _modifiers: {
        elevated: {
          boxShadow: `0px 0.2px 0.3px hsl(var(--shadow-color) / 0.06),
    0px 0.9px 1.2px -0.4px hsl(var(--shadow-color) / 0.09),
    0px 2.1px 2.8px -0.8px hsl(var(--shadow-color) / 0.11),
    0.1px 4.6px 6px -1.2px hsl(var(--shadow-color) / 0.14)`,
        },
      },
    };
  },
});
