import React from "react";
import ChatProvider from "../Context/chatProvider.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { Button, ButtonGroup } from "@chakra-ui/react";
import Home from "./Components/Home";
import Chats from "./Components/Chats";

const App = () => {
  return (
    <>
      <ChatProvider>
        <div className="app">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/chats" element={<Chats />} />
          </Routes>
        </div>
      </ChatProvider>
    </>
  );
};

export default App;
