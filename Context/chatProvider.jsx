import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState();
  const [selectedChat, setSeletedChat] = useState();
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();
  // const server = "http://localhost:5000";
  const server = "https://chatbackend.tushargadher25.repl.co";

  useEffect(() => {
    //getting info of logged in user
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    // console.log(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSeletedChat,
        chats,
        setChats,
        notification,
        setNotification,

        server,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const chatState = () => {
  return useContext(chatContext);
};
export default ChatProvider;
