"use client";
import { createContext,useContext } from "react";
import BASE_URL from "@/config/api";

const ApiContext = createContext();

export const  ApiProvider = ({children}) =>{
return(
<ApiContext.Provider value={{BASE_URL}}>
    {children}
</ApiContext.Provider>
);
};

export const useApi = () => useContext(ApiContext);


