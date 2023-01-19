import React, { useState } from "react";
import Login from "../components/Pages/Login";
import Registration from "../components/Pages/Registration";

/**
 * Component that renders either the Login or Registration page.
 * Allows switching between the pages.
 * @returns {JSX.Element} The JSX Element to render
 */
export default function UserLogin() {
  const [showLogin, setShowLogin] = useState(false);
  return showLogin ? (
    <Login />
  ) : (
    <Registration showLogin={() => setShowLogin(true)} />
  );
}
