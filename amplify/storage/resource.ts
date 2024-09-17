import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "listingImages",
  access: (allow) => ({
    "public/*": [
      allow.authenticated.to(["read", "write", "delete"]),
      allow.guest.to(["read", "write", "delete"]),
    ],
    "images/{entity_id}/*": [
      // {entity_id} is the token that is replaced with the user identity id
      allow.entity("identity").to(["read", "write", "delete"]),
      allow.guest.to(["read"]),
    ],
    "protected/{entity_id}/*": [
      // {entity_id} is the token that is replaced with the user identity id
      allow.entity("identity").to(["read", "write", "delete"]),
      allow.guest.to(["read"]),
    ],
  }),
});
