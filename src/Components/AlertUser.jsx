import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { chatState } from "../../Context/chatProvider";
const AlertUser = ({ children, handleLogout }) => {
  const { user } = chatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : <></>}

      <AlertDialog isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Attention...! {user.name}.
            </AlertDialogHeader>

            <AlertDialogBody>
              You will be returned to the login screen
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose} fontWeight="400">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onClose();
                  handleLogout();
                }}
                ml={3}
                fontWeight="400"
              >
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AlertUser;

//continue from here display alret when user logout
