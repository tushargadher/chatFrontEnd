import {
  Box,
  Button,
  Menu,
  Text,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import { chatState } from "../../Context/chatProvider";
import { useDisclosure } from "@chakra-ui/hooks";
import ProfileModel from "./ProfileModel";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import AlertUser from "./AlertUser";
import { getSender } from "../../Config/chatLogic";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import GroupChatModel from "./GroupChatModel";
const SideBar = ({ bg, color, toggleColorMode }) => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    selectedChat,
    setSeletedChat,
    chats,
    setChats,
    server,
    notification,
    setNotification,
  } = chatState();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast({
      title: "Logout Successful",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    navigate("/");
  };

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

      //if user click on chat which is already in the chats then not render it again
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSeletedChat(data);
      //for closing the side dreawer this function is called
      onClose();
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

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems={"center"}
        bg={bg}
        color={color}
        w="100%"
        p={{ base: "0.1rem", md: "0.4rem" }}
        borderWidth="5px"
        borderColor={bg}
      >
        {/* search user */}
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* app name */}
        <Text fontSize="2xl" display={{ base: "none", md: "flex" }}>
          React Chat App
        </Text>
        {/* <Text>Add Delete user functionality</Text> */}

        <Box>
          {/* switch theme button */}
          <Tooltip
            label="Switch Between Dark and Light Mode"
            hasArrow
            placement="bottom-end"
          >
            <Button onClick={toggleColorMode} variant="ghost">
              {bg === "white" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Tooltip>
          {/* notification menu */}
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1}></BellIcon>
            </MenuButton>
            <MenuList pl={3}>
              {!notification.length && "No New Messages"}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSeletedChat(notify.chat);
                    //removing notification after user click on it
                    setNotification(notification.filter((n) => n !== notify));
                  }}
                >
                  {/* {console.log(notify)} */}
                  {/* if groupchat then display groupname else display sender name */}
                  {notify.chat.isGroupChat
                    ? `New Message in ${notify.chat.chatName}`
                    : `New Message From ${getSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* user profile menu */}

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Box display={{ base: "flex", md: "none" }}>
                <i class="fa-solid fa-gear"></i>
              </Box>
              <Avatar
                name={user.name}
                src={user.pic}
                size="sm"
                display={{ base: "none", md: "flex" }}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem paddingY={2}>
                  <i className="fa-solid fa-user marginRight"></i>Profile
                </MenuItem>
              </ProfileModel>

              <GroupChatModel>
                <MenuItem paddingY={2}>
                  <i className="fa-solid fa-user-group marginRight"></i>
                  New Group
                </MenuItem>
              </GroupChatModel>
              <AlertUser handleLogout={handleLogout}>
                <MenuItem paddingY={2}>
                  <i className="fa-sharp fa-solid fa-arrow-right-from-bracket marginRight"></i>
                  Log Out
                </MenuItem>
              </AlertUser>
              <MenuItem paddingY={2}>
                <i className="fa-regular fa-trash-can marginRight"></i>Delete
                Account
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* search user drawver */}

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" marginBottom={3}>
              <Input
                placeholder="Enter Name or Email"
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
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;
