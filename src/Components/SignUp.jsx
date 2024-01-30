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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { server } = chatState();
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const handleChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const postDetails = (pics) => {
    setLoading(true);

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      //calling api to store profile picture
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "drlt8abdn");

      fetch("https://api.cloudinary.com/v1_1/drlt8abdn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(pic);
          console.log(data.url);
          setPic(data.url.toString());
          setLoading(false);
          console.log(pic);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const handleShow = () => {
    setShow(!show);
  };

  const handleSubmit = async () => {
    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.password ||
      !credentials.cpassword
    ) {
      toast({
        title: "Please Fill All The Details!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    //if password is not match
    if (credentials.password !== credentials.cpassword) {
      toast({
        title: "Password Mismatch !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    //api call for signup
    try {
      const { name, email, password } = credentials;
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${server}/api/user/signUp`,
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful...Login to continue...",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      // navigate('/');
      setCredentials({
        name: "",
        email: "",
        password: "",
        cpassword: "",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong. User Registration Failed !",
        status: "error",
        // description: error.response.data,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
    }
  };

  return (
    <VStack spacing="1rem">
      <FormControl id="name" isRequired>
        <FormLabel color="black">Name</FormLabel>
        <Input
          placeholder="Enter Your name"
          name="name"
          onChange={handleChange}
          value={credentials.name}
          borderColor="gray.300"
          color="black"
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel color="black">Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          name="email"
          onChange={handleChange}
          value={credentials.email}
          borderColor="gray.300"
          color="black"
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel color="black">Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            name="password"
            onChange={handleChange}
            value={credentials.password}
            placeholder="Enter Password"
            borderColor="gray.300"
            color="black"
          />
          <InputRightElement width="4.5rem ">
            <Button h="1.75rem" size="sm" onClick={handleShow} color="black">
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="cpassword" isRequired>
        <FormLabel color="black">Confrom Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            name="cpassword"
            onChange={handleChange}
            value={credentials.cpassword}
            placeholder="Enter Password"
            borderColor="gray.300"
            color="black"
          />
          <InputRightElement width="4.5rem " color="black">
            <Button h="1.75rem" size="sm" onClick={handleShow}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="image" isRequired>
        <FormLabel color="black">Upload Profile Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1.5}
          onChange={(e) => postDetails(e.target.files[0])}
          border="none"
          color="black"
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        <Text fontWeight={300}>Sign Up</Text>
      </Button>
    </VStack>
  );
};
export default SignUp;
