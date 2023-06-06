import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { chatState } from "../../Context/chatProvider";

const Login = () => {
  const { server } = chatState();
  const toast = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };
  const handleShow = () => {
    setShow(!show);
  };
  const handleSubmit = async () => {
    setLoading(true);

    if (!credentials.email || !credentials.password) {
      toast({
        title: "Please Enter Email and Password",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    //api call for login
    try {
      const { email, password } = credentials;
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${server}/api/user/login`,
        {
          email,
          password,
        },
        config
      );
      setLoading(false);

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
      setCredentials({
        email: "",
        password: "",
      });
    } catch (error) {
      toast({
        title: "Something went wrong. User Login Failed !",
        status: "error",
        description: error.response.data,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      console.log(error);
    }
  };

  const setGuest = () => {
    setCredentials({
      email: "guestuser123@gmail.com",
      password: "123456",
    });
  };
  return (
    <VStack spacing="1rem" color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          name="email"
          onChange={handleChange}
          value={credentials.email}
          color="black"
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            name="password"
            onChange={handleChange}
            value={credentials.password}
            placeholder="Enter Password"
          />
          <InputRightElement width="4.5rem ">
            <Button h="1.75rem" size="sm" onClick={handleShow}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        <Text fontWeight={300}>Login</Text>
      </Button>

      <Button
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={setGuest}
      >
        <Text fontWeight={300}>Get Guest User Credentials</Text>
      </Button>
    </VStack>
  );
};
export default Login;
