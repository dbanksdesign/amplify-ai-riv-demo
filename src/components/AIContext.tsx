import React from "react";

export const AIContext = React.createContext<{
  data: object;
  setData: (value: React.SetStateAction<object>) => void;
}>({ data: {}, setData: () => {} });

export const AIContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element => {
  const [data, setData] = React.useState({});
  return (
    <AIContext.Provider value={{ data, setData }}>
      {children}
    </AIContext.Provider>
  );
};
