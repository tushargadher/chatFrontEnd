import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../../Config/chatLogic";
import { chatState } from "../../Context/chatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
const ScrollableChats = ({ messages }) => {
  const { user } = chatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((msg, index) => (
          <div style={{ display: "flex"}} key={msg._id} >
            {/* logic for displaying sender img at end of last message */}
            {(isSameSender(messages, msg, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Tooltip
                label={msg.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={msg.sender.name}
                  src={msg.sender.pic}
                />
              </Tooltip>
            )}

            {/* message content here */}
            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user._id ? "#85C1E9" : "#58D68D"
                }`,
                borderRadius: "8px",
                padding: "3px 13px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, msg, index, user._id),
                marginTop: isSameUser(messages, msg, index, user._id) ? 4 : 10,
                // fontSize:"1rem"
                color: "black",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChats;
