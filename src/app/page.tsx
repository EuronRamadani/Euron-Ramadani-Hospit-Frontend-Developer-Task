// src/pages/index.tsx
import React from "react";
import UserTable from "../components/UserTable";
import "../app/globals.css";

const Home: React.FC = () => {
  return (
    <div>
      <UserTable />
    </div>
  );
};

export default Home;
