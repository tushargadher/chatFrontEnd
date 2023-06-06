import React, { useState, useEffect } from "react";
import { chatState } from "../../Context/chatProvider";
import { Text, useToast } from "@chakra-ui/react";
import { Box, Button, Stack } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../../Config/chatLogic";
import GroupChatModel from "./GroupChatModel";
const MyChats = ({ fetchAgain, bg, color, chatBg }) => {
  const {
    user,
    setUser,
    selectedChat,
    setSeletedChat,
    chats,
    setChats,
    server,
  } = chatState();
  const [loggedUser, setLoggedUser] = useState(user);
  const toast = useToast();

  //fetch all chats
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, //logged in user token
        },
      };
      //api call, to fetch all chats of logged in user
      const { data } = await axios.get(
        `${server}/api/chat`, //if the key and value are same then no need to write both
        config
      );
      // console.log(data);
      setChats(data);
      // console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured while Fetching the Chats",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    // after selecting chat this box is hidden if chat is not selected then it will be shown (it only apply for smaller size device)

    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={bg}
      color={color}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Chats
        <GroupChatModel>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg={bg}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSeletedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : `${chatBg}`}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                {/* {console.log([chat])} */}
                <Text>
                  {/* if chat is groupchat then display groupchat name else display sender name */}
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
export default MyChats;
