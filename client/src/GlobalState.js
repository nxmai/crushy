import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import UserAPI from "./api/authApi";

export const GlobalState = createContext();

export const DataProvider = ({children}) => {
    const [token, setToken] = useState(false);

    useEffect(() => {
        const firstLogin = localStorage.getItem('login');
        if(firstLogin){
            const refreshToken = async () => {
                const res = await axios.get("/user/refresh_token");

                setToken(res.data.token);

                setTimeout(() => {
                    refreshToken();
                }, 3 * 60 * 1000);
            }

            refreshToken();
        }
    }, [])

    const state = {
        token: [token, setToken],
        userAPI: UserAPI(token),
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )

}