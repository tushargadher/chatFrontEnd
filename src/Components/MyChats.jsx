import React, { useState, useEffect } from "react";
import { chatState } from "../../Context/chatProvider";
import { Text, useToast } from "@chakra-ui/react";
import { Box, Button, Stack, Avatar } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import { getSender, getSenderProfile } from "../../Config/chatLogic";

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

      setChats(data);
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
      borderWidth="1px"
      borderColor={bg}
      borderTopColor="gray.600"
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
                // color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="md"
                key={chat._id}
                color={color}
                display="flex"
                alignItems="center"
              >
                <Avatar
                  src={getSenderProfile(loggedUser, chat.users)}
                  size={{ base: "sm", md: "md" }}
                  marginRight={3}
                ></Avatar>
                <Box>
                  <Text fontWeight={"bold"}>
                    {/* if chat is groupchat then display groupchat name else display sender name */}
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>

                  <Text opacity="0.7">
                    {chat.latestMessage && (
                      <>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </>
                    )}
                  </Text>
                </Box>
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
