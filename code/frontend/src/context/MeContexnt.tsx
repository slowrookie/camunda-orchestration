import { createContext, useContext } from "react";
import { ReactNode } from "react";
import { Me } from "../services/auth.service";



const MeContext = createContext<Me | null | undefined>(null);

export const MeProvider = ({ children, value }: { children: ReactNode, value: Me }) => {
  return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
};

export const useMe = () => {
  return useContext(MeContext);
};