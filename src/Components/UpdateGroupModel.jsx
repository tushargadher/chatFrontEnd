import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button,
  Image,
  Text,
  FormControl,
  Input,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import { chatState } from "../../Context/chatProvider";
import axios from "axios";
import UsreBadge from "./UsreBadge";
import UserListItem from "./UserListItem";
const UpdateGroupModel = ({
  fetchAgain,
  setFetchAgain,
  bg,
  color,
  fetchAllmessage,
  children
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSeletedChat, server } = chatState();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  //name is groupname
  const [name, setName] = useState();
  const [result, setResult] = useState();
  const [search, setSearch] = useState([]);

  //for removing user form the group
  const handleRemove = async (user2) => {
    if (selectedChat.groupAdmin._id !== user._id && user2._id !== user._id) {
      toast({
        title: "Only Group Admin can Remove or Add Users",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
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
      const { data } = await axios.put(
        `${server}/api/chat/groupremove`,
        {
          userID: user2._id,
          groupID: selectedChat._id,
        },
        config
      );

      //this function is also called when user click on leave that's why this below condition is included
      user2._id === user._id ? setSeletedChat() : setSeletedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllmessage();
      console.log(data);
      setLoading(false);
      toast({
        title: `${user2.name} Removed successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error While Adding User!",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  //add user in group
  const addTogroup = async (user1) => {
    console.log(selectedChat);

    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in Group!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    //user is logged in user
    //only group admin can add or remove people from the  group
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Group Admin can Remove or Add Users",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
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
      const { data } = await axios.put(
        `${server}/api/chat/addToGroup`,
        {
          userID: user1._id,
          groupID: selectedChat._id,
        },
        config
      );
      setSeletedChat(data);
      setFetchAgain(!fetchAgain);
      console.log(data);
      setLoading(false);
      toast({
        title: `${user1.name} added successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error While Adding User!",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  //api call function for rename the group name
  const handleRename = async () => {
    console.log(selectedChat);
    if (!name) {
      toast({
        title: "Please Enter Group Name",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      //api call, return all user expect the logged in user
      const respone = await axios.put(
        `${server}/api/chat/rename`,
        {
          name,
          groupID: selectedChat._id,
        },
        config
      );
      console.log(respone.data);
      //setSeletedChat is thorwing error because response data is object
      setSeletedChat(respone.data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast({
        title: "Group Name Updated!!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log(error);
      setRenameLoading(false);
      toast({
        title: "Error while updating name!",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    setName("");
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
      console.log(data);
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
  return (
    <>
      {/* <IconButton
        display="flex"
        icon={<ViewIcon />}
        onClick={onOpen}
      ></IconButton> */}
  <span onClick={onOpen}>{children}</span>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent overflow="hidden">
          <ModalHeader
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            bg={bg}
            color={color}
          >
            {selectedChat.chatName}
            <Text
              fontSize="sm"
              fontWeight={100}
            >{`Admin : ${selectedChat.groupAdmin.name}`}</Text>
          </ModalHeader>

          <ModalBody>
            <Text fontSize="md">Users</Text>
            <Box
              display="flex"
              w="100%"
              flexWrap="wrap"
              alignItems="center"
              marginBottom={2}
            >
              {selectedChat.users.map((user) => (
                <UsreBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl>
              {/* update groupchat name */}
              <Box display="flex">
                <Input
                  placeholder="New Group Name"
                  name="name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                  marginBottom={4}
                />
                <Button
                  colorScheme="green"
                  ml={2}
                  fontWeight="400"
                  isLoading={renameloading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </Box>
            </FormControl>

            {/* add user to group  */}
            <FormControl>
              <Input
                placeholder="Add User To Group"
                onChange={(e) => {
                  setSearch(e.target.value);
                  hanldeSearch();
                }}
                marginBottom={2}
              />
            </FormControl>
            {loading ? (
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
                </Box>
              </>
            ) : (
              <></>
            )}
            {result?.slice(0, 4).map((user) => (
              // console.log(user)
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => addTogroup(user)}
              />
            ))}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} fontWeight="400">
              Cancel
            </Button>
            {/* here user is logged in user */}
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleRemove(user);
                onClose;
              }}
              ml={3}
            >
              Leave
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModel;
