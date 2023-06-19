import React, { useState, useEffect } from "react";
import { chatState } from "../../Context/chatProvider";
import {
  Box,
  Button,
  Stack,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  Spinner,
  Text,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { getSender, getSenderProfile } from "../../Config/chatLogic";
import { useDisclosure } from "@chakra-ui/hooks";
import SideBar from "./SideBar";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
const MyChats = ({ fetchAgain, bg, color, chatBg, toggleColorMode ,ChatsColor}) => {
  const {
    user,
    setUser,
    selectedChat,
    setSeletedChat,
    chats,
    setChats,
    server,
  } = chatState();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loggedUser, setLoggedUser] = useState(user);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //search user function
  const hanldeSearch = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      //api call, return all user expect the logged in user
      const { data } = await axios.get(
        `${server}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Sreach Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, //logged in user token
        },
      };
      //api call, to get chat of two user  one logged in user and second is request user
      const { data } = await axios.post(
        `${server}/api/chat`,
        { userId }, //if the key and value are same then no need to write both
        config
      );
      setLoadingChat(false);
      // console.log(data);
      //to close the drawer after creating chat
      onClose();
      //if user click on chat which is already in the chats then not render it again
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSeletedChat(data);
    } catch (error) {
      setLoadingChat(false);
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
      // p={3}
      bg={bg}
      color={color}
      w={{ base: "100%", md: "31%" }}
      borderWidth="1px"
      borderColor={bg}
    >
      {user && (
        <SideBar bg={bg} color={color} toggleColorMode={toggleColorMode} />
      )}
      <Box
        bg={ChatsColor}
        p={2}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button
            variant="outline"
            onClick={onOpen}
            width="100%"
            display="flex"
            justifyContent="flex-start"
            fontSize="sm"
            fontWeight="light"
            bg={bg}
            border="none"
            opacity="0.7"
          >
            <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search or start new start
            </Text>
          </Button>
        </Tooltip>
      </Box>

      {/* chat box */}
      <Box
        display="flex"
        flexDir="column"
        bg={ChatsColor}
        w="100%"
        h="100%"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSeletedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? bg : ""}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
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
        {/* search user drawver */}

        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>Search Users</DrawerHeader>

            <DrawerBody>
              <Box display="flex" marginBottom={3}>
                <Input
                  placeholder="Search or start New Chat"
                  mr={2}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    hanldeSearch();
                  }}
                />
                {/* <Button onClick={hanldeSearch}>Go</Button> */}
              </Box>

              {loading ? (
                <ChatLoading />
              ) : (
                result?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    //sending user id of which user click on
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && (
                <>
                  <Box display="flex" alignItems="center">
                    <Spinner
                      thickness="3px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="md"
                      margin={2}
                    />
                    <Text>Please Wait...</Text>
                  </Box>{" "}
                </>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </Box>
  );
};
export default MyChats;
