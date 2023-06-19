import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { chatState } from "../../Context/chatProvider";
import { Box, useColorMode, useColorModeValue } from "@chakra-ui/react";

import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

// this is main component after user is logged in then it will redirect to this component
//this component have two child component Mychats and ChatBox
const Chats = () => {
  // parent state
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = chatState();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("#F0F2F5", "#222E35");
  const color = useColorModeValue("black", "white");
  const ChatsColor = useColorModeValue("white", "#111B21");
  const chatBg = useColorModeValue("#E8E8E8", "gray.500");

  return (
    <>
      <div style={{ width: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="100vh"
          // padding="5"
          padding={{ base: 0, md: 5 }}
        >
          {user && (
            <MyChats
              fetchAgain={fetchAgain}
              bg={bg}
              color={color}
              chatBg={chatBg}
              toggleColorMode={toggleColorMode}
              ChatsColor={ChatsColor}
            />
          )}
          {user && (
            <ChatBox
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              bg={bg}
              color={color}
              chatBg={chatBg}
            />
          )}
        </Box>
      </div>
    </>
  );
};
export default Chats;
