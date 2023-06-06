import React from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user, handleFunction }) => {
  const { name, email, pic } = user;
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="md"
    >
      <Avatar mr={2} size="sm" cursor="pointer" name={name} src={pic} />
      <Box>
        <Text>{name}</Text>
        <Text fontSize="xs">{email}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
