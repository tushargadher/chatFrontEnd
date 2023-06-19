import React from "react";
import { chatState } from "../../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import DarkBgChat from "../assets/DarkBGChat.jpg"
import LightBgChat from "../assets/LightBgchat.jpg"
const ChatBox = ({ fetchAgain, setFetchAgain, bg, color, chatBg }) => {
  const { selectedChat } = chatState();
  return (
    <>
      {/* if chat is selected then this box is shown else it is hidden (it is only apply for smaller size device) */}
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDir="column"
        // p={3}
        bg={bg}
        color={color}
        w={{ base: "100%", md: "70%" }}
        borderWidth="1px"
        borderColor={bg}
        borderLeftColor={{ base: { bg }, md: "gray.600" }}
      >
        {/* sending parent state from   chats -> chatBox -> SingleChat */}
        <SingleChat
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          bg={bg}
          color={color}
          chatBg={chatBg}
        />
      </Box>
    </>
  );
};
export default ChatBox;
