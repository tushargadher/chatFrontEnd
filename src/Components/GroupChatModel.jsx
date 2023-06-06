import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Input,
  useToast,
  Spinner,
  FormControl,
  Box,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { chatState } from "../../Context/chatProvider";
import UserListItem from "./UserListItem";
import UsreBadge from "./UsreBadge";
import axios from "axios";
const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  //name is groupname
  const [name, setName] = useState();
  const [result, setResult] = useState();
  const [search, setSearch] = useState([]);
  const [selectedUser, setSeletedUser] = useState([]);
  const toast = useToast();

  const { user, chats, setChats, server } = chatState();

  //create groupchat function
  const createGroup = async () => {
    if (!name || !selectedUser) {
      toast({
        title: "Please Enter All Feilds To Create Group Chat !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedUser.length < 2) {
      toast({
        title: "Minimum 2 user required to create groupchat!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, //logged in user token
        },
      };
      //api call, to create groupchat
      const { data } = await axios.post(
        `${server}/api/chat/group`,
        {
          name,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      toast({
        title: `New Group Chat ${data.chatName} Created.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured while Creating Group chat",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  //sreach user fuction to add into group
  const hanldeSearch = async () => {
    if (!search) {
      return;
    }
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
      console.log(error);
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  //when user click on searched user
  const handleGroup = (user) => {
    if (selectedUser.includes(user)) {
      toast({
        title: "User Already Added...",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setSeletedUser([...selectedUser, user]);
  };

  //when user click on userBadge this function is called
  const handleDelete = (user) => {
    //return all user expect given user
    setSeletedUser(
      selectedUser.filter((seleUser) => seleUser._id !== user._id)
    );
  };
  return (
    <>
      {/* {console.log(selectedUser)} */}
      <span onClick={onOpen}>{children}</span>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
        // size={{ base: "sm", md: "md" }}
        
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="2rem"
            display="flex"
            justifyContent="center"
            fontWeight="400"
          >
            Create Group Chat
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControl>
              {/* groupchat name */}
              <Input
                placeholder="Group Name"
                name="email"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                marginBottom={4}
              />
            </FormControl>
            {/* add user  */}
            <FormControl>
              <Input
                placeholder="Add Users eg: Tushar,Anil,Hiral"
                onChange={(e) => {
                  setSearch(e.target.value);
                  hanldeSearch();
                }}
                marginBottom={4}
              />
            </FormControl>
            {/* display selected user */}
            <Box display="flex" w="100%" flexWrap="wrap">
              {selectedUser.map((user) => (
                <UsreBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            {/* diplaying search user list */}
            {loading ? (
              <Box display="flex">
                <Spinner marginRight={2} />
                <span>Searching User...</span>
              </Box>
            ) : (
              //only displaying first four result
              result?.slice(0, 4).map((user) => (
                // console.log(user)
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} fontWeight="400">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              ml={3}
              onClick={() => {
                createGroup();
                onClose();
              }}
              fontWeight="400"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
