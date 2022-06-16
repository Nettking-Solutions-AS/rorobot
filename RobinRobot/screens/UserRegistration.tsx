import React, { useState } from "react";
import Login from "../components/Pages/Login";
import Registration from "../components/Pages/Registration";

export default function UserRegistration() {
  const [showRegistration, setShowRegistration] = useState(false);
  return showRegistration ? (
    <Registration />
  ) : (
    <Login showRegistration={() => setShowRegistration(true)} />
  );
}