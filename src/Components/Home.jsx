import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Text,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Image,
  Stack,
} from "@chakra-ui/react";
import Login from "./Login";
import SignUp from "./SignUp";
const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  });
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1640244674671-f32e0f186e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          }
        />
      </Flex>
      <Flex
        p={4}
        flex={1}
        direction="column"
        align={"center"}
        justify={"center"}
      >
        <Box
          p={3}
          bg={"white"}
          color="black"
          w={{ base: "100%", md: "80%" }}
          m="0px 0 15px 0"
          borderRadius="md"
          borderWidth="1px"
        >
          <Text fontSize={{ base: "2xl", md: "4xl" }} textAlign="center">
            Welcome to ChatBox
          </Text>
        </Box>
        <Box
          bg={"white"}
          w={{ base: "100%", md: "80%" }}
          p={4}
          borderRadius="md"
          borderWidth="1px"
        >
          <Tabs variant="soft-rounded" isFitted>
            <TabList>
              <Tab>Login</Tab>
              <Tab>SingUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Stack>
  );
};
export default Home;
