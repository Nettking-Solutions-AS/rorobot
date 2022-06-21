import axios from "axios"
import React, { useState, useEffect } from "react";
import { useGlobalState } from "../StateManagement/GlobalState";

export default function Dashboard() {
  const { state } = useGlobalState();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const uri = "https://robinserver.onrender.com";
    const response = await axios.post(uri, { userID: state.currentUser.id });
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    
  )
}