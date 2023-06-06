import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { chatState } from "../../Context/chatProvider";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import SideBar from "./SideBar";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

// this is main component after user is logged in then it will redirect to this component
//this component have two child component Mychats and ChatBox
const Chats = () => {
  // parent state
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = chatState();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.600");
  const color = useColorModeValue("black", "white");
  const chatBg = useColorModeValue("#E8E8E8", "gray.300");
  

  return (
    
    <>
      <div style={{ width: "100%" }}>
        {user && (
          <SideBar bg={bg} color={color} toggleColorMode={toggleColorMode} />
        )}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChats fetchAgain={fetchAgain} bg={bg} color={color} chatBg={chatBg} />}
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
