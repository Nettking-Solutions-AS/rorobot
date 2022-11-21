//@ts-nocheck
import React, { useState } from "react";
import Login from "../components/Pages/Login";
import Registration from "../components/Pages/Registration";

export default function UserLogin() {
  const [showLogin, setShowLogin] = useState(false);
  return showLogin ? (
    <Login />
  ) : (
    <Registration showLogin={() => setShowLogin(true)} />
  );
}
