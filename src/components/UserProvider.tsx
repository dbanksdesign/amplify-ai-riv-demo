"use client";
import * as React from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { Schema } from "@/../amplify/data/resource";
import { client, authClient } from "@/client";

interface UserContextProps {
  user?: Schema["User"]["type"];
}

export const UserContext = React.createContext<UserContextProps>({});

export const UserProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<Schema["User"]["type"]>();

  React.useEffect(() => {
    fetchAuthSession().then((sesh) => {
      console.log({ sesh });
      client.models.User.list({
        filter: {
          identityId: {
            eq: sesh.identityId ?? "",
          },
        },
      }).then(({ data, ...rest }) => {
        console.log({ data, rest });
        if (!data || data?.length < 1) {
          // no user model exists, create one
          authClient.models.User.create({
            identityId: sesh.identityId,
            username: sesh.identityId,
          }).then(({ data }) => {
            console.log({ data });
            setUser(data);
          });
        } else {
          setUser(data[0]);
          // client.models.User.onUpdate({
          //   filter: {
          //     id: {
          //       eq: data[0]?.id,
          //     },
          //   },
          // }).subscribe({
          //   next: (user) => {
          //     setUser(user);
          //   },
          // });
        }
      });
    });
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
