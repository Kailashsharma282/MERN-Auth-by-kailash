import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance"; // ✅ use custom instance

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axiosInstance.get("/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        await getuserData(); // ✅ only if is-auth passed
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      setIsLoggedin(false);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getuserData = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/data");
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState(); // check login once app mounts
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getuserData,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
