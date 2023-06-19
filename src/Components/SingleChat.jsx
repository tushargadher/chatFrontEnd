import React, { useState, useEffect } from "react";
import { chatState } from "../../Context/chatProvider";
import {
  Box,
  IconButton,
  Text,
  Spinner,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Img,
} from "@chakra-ui/react";
import {
  getSender,
  getSenderFull,
  getSenderProfile,
} from "../../Config/chatLogic";
// import icon from "../assets/icon.png";
import DarkBgChat from "../assets/DarkBGChat.jpg";
import LightBgChat from "../assets/LightBgchat.jpg";
import NochatLogoDark from "./NochatLogoDark";
import NochatLogoWhitle from "./NochatLogoWhitle";
import ProfileModel from "./../Components/ProfileModel";
import ScrollableChats from "./ScrollableChats";
import UpdateGroupModel from "./UpdateGroupModel";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../Animation/Typing.json";

var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain, bg, color, chatBg }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const toast = useToast();
  const {
    user,
    selectedChat,
    setSeletedChat,
    server,
    notification,
    setNotification,
  } = chatState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(server);
    //sending logged user data to backend
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    //newMessageRecieved contain data which we get from sendMessage api
    socket.on("message recieved", (newMessageRecieved) => {
      // if chat is not selected or selected chat is not received chat then only show notification
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //if received message is not then notification then only add received message in notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
          console.log(newMessageRecieved);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const fetchAllmessage = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, //logged in user token
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${server}/api/message/${selectedChat._id}`,
        config
      );
      setLoading(false);
      setMessages(data);

      //creating room with the id so user can join room
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      // console.log(error);
      toast({
        title: "Unable to Load Messages.!",
        status: "error",
        description: error.response.data,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const sendMessage = async (e) => {
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`, //logged in user token
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        `${server}/api/message`,
        {
          content: newMessage,
          chatID: selectedChat._id,
        },
        config
      );
      // console.log(data);
      //data contain the new message send from the user
      socket.emit("new message", data);
      //appending new message into chat
      setMessages([...messages, data]);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Message Not Send!",
        status: "error",
        description: error.response.data,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    //check if socket is connected or not
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //if we dont give dependancy array in useEffect then it will run after every render
  useEffect(() => {
    fetchAllmessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  return (
    <>
      {/* {console.log(notification)} */}
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "21px", md: "28px" }}
            p="0.7rem"
            // pb={3}
            // px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }} //when sreen get smaller it align in center
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSeletedChat("")} //if no chat is selected then hide single chat
            />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName}
                <UpdateGroupModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchAllmessage={fetchAllmessage}
                  bg={bg}
                  color={color}
                />
              </>
            ) : (
              <>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={getSenderProfile(user, selectedChat.users)}
                    size={{ base: "sm", md: "md" }}
                    marginRight={3}
                  ></Avatar>
                  {getSender(user, selectedChat.users)}
                </Box>
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            )}
          </Text>
          {/* chating box */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end" //so new message will in the bottem
            p={3}
            // bg={chatBg}
            backgroundImage={DarkBgChat}
            color={color}
            w="100%"
            h="100%"
            overflowY="hidden"
          >
            {loading ? (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  color="black"
                  alignSelf="center"
                  margin="auto"
                >
                  <Spinner
                    thickness="3px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="lg"
                    margin={2}
                  />
                  <Text>Loading chat...</Text>
                </Box>
              </>
            ) : (
              <div className="messsages">
                <ScrollableChats messages={messages} />
              </div>
            )}
            <FormControl id="email" isRequired marginTop={5}>
              {istyping ? (
                <>
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </>
              ) : (
                <></>
              )}
              <InputGroup size="md">
                <Input
                  placeholder="Type Message"
                  _placeholder={{ color: "black" }}
                  variant="filled"
                  onChange={handleTyping}
                  value={newMessage}
                  color="black"
                  bg={bg}
                />
                <InputRightElement>
                  <Button
                    onClick={sendMessage}
                    cursor="pointer"
                    bg="gray.300"
                    color="black"
                  >
                    <i class="fa-regular fa-paper-plane"></i>
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          flexDirection="column"
        >
          {/* <img src={nochat}></img> */}
          {color == "white" ? <NochatLogoDark /> : <NochatLogoWhitle />}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            justifyContent="space-evenly"
          >
            <Text fontSize="3xl" pt={3} pb={3}>
              WhatsApp Web
            </Text>
            <Text fontSize="sm" opacity="0.7" fontWeight="light">
              Send and revice messages without keeping your phone online.
            </Text>
            <Text fontSize="sm" pb={3} opacity="0.7" fontWeight="light">
              Use WhatsApp on up to 4 linked devices and 1 phone at the same
              time.
            </Text>
            <Text fontSize="sm" pb={3} opacity="0.7" fontWeight="light">
              End to end encrpyted
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
