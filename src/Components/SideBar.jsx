import {
  Box,
  Button,
  Menu,
  Avatar,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { BellIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import React from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { chatState } from "../../Context/chatProvider";
import ProfileModel from "./ProfileModel";
import AlertUser from "./AlertUser";
import { getSender } from "../../Config/chatLogic";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import GroupChatModel from "./GroupChatModel";
const SideBar = ({ bg, color, toggleColorMode }) => {
  const {
    user,

    setSeletedChat,

    notification,
    setNotification,
  } = chatState();
  const toast = useToast();
  const navigate = useNavigate();

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

        {/* app name
        <Text fontSize="2xl" display={{ base: "none", md: "flex" }}>
        ChatBox 
        </Text> */}
        {/* <Text>Add Delete user functionality</Text> */}
        <Avatar
          mr={2}
          size="md"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
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
            <MenuList pl={3} >
              {!notification.length && "No New Messages"}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    //to open chat when user click on notification
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
            <MenuButton as={IconButton} aria-label="Options" variant="ghost">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </MenuButton>
            <MenuList fontWeight="light" fontSize="sm">
              <GroupChatModel>
                <MenuItem paddingY={2}>New Group</MenuItem>
              </GroupChatModel>
              <ProfileModel user={user}>
                <MenuItem paddingY={2}>Profile</MenuItem>
              </ProfileModel>
              <AlertUser handleLogout={handleLogout}>
                <MenuItem paddingY={2}>Log Out</MenuItem>
              </AlertUser>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default SideBar;
