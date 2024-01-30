import React from "react";
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
  Box,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {/* if the children is not there then display eye icon */}
      {/* {console.log(user)} */}
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display="flex"
          icon={<ViewIcon />}
          onClick={onOpen}
        ></IconButton>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2rem" display="flex" fontWeight={400}>
            User Profile
            {/* {user.name} */}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            bg=""
            alignItems="center"
          >
            <Box
              display="flex"
              alignItems="center"
              marginBottom={3}
              width="100%"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Box>
                <Image
                  src={user.pic}
                  alt={user.name}
                  borderRadius="full"
                  boxSize="10rem"
                  objectFit="contain"
                  boxShadow="xl"
                />
              </Box>
              <Box bg="" padding={3}>
                <Text fontSize="1rem" padding="0.5rem">
                  <i class="fa-solid fa-user marginRight"></i> {user.name}
                </Text>

                <Text fontSize="1rem" padding="0.5rem">
                  <i class="fa-regular fa-envelope marginRight"></i>
                  {user.email}
                </Text>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;

// <Button onClick={onOpen}>Open Modal</Button>
