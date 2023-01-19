import React, { useState } from "react";
import Login from "../components/Pages/Login";
import Registration from "../components/Pages/Registration";

/**
 * Component that renders either the Login or Registration page.
 * Allows switching between the pages.
 * @returns {JSX.Element} The JSX Element to render
 */
export default function UserRegistration() {
  const [showRegistration, setShowRegistration] = useState(false);
  return showRegistration ? (
    <Registration />
  ) : (
    <Login showRegistration={() => setShowRegistration(true)} />
  );
}
