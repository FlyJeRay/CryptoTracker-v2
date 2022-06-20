import { createContext } from "react";

interface contextInterface { 
  ctx_value: string,
  ctx_setter: React.Dispatch<React.SetStateAction<string>>
}

export const TokenContext = createContext<contextInterface>({} as contextInterface);