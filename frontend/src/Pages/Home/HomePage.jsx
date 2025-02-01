import React from "react";

import HomeScreen from "../Home/HomeScreen";
import AuthScreen from "../Home/AuthPage";
import { useAuthStore } from "../../Store/AuthStore";

const HomePage = () => {
  const { user } = useAuthStore();

  return <div>{user ? <HomeScreen /> : <AuthScreen />}</div>;
};

export default HomePage;
