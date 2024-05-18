import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE } from "@/utils/ApiRoutes";
import { data } from "autoprefixer";
import { useRouter } from "next/router";
import axios from "axios";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import { HOST } from "@/utils/ApiRoutes";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
  const router = useRouter();
  const [{ userInfo, currentChatUser , messages, messagesSearch, userContacts}, dispatch] = useStateProvider();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  
  const socket = useRef();

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });

      if (!data.status) {
        router.push("/login");
      }
      if (data?.data) {
        const {
          id,
          name,
          email,
          profilePicture: profileImage,
          status,
        } = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status,
          },
        });
      }
    }
  });


  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);

  useEffect(()=>{
    if(socket.current && !socketEvent)
    {
      socket.current.on("msg-recieve",(data)=>{
        dispatch({
          type:reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });

      socket.current.on("online-users",({onlineUsers})=>{
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        });
      });

      socket.current.on("mark-read-recieve", ({ id, recieverId }) => {
        dispatch({
          type: reducerCases.SET_MESSAGES_READ,
          id,
          recieverId,
        });
      });

      setSocketEvent(true)
    }

  },[socket.current]);

  useEffect(() => {
    const getMessages = async () => {
      let Userid = userInfo?.id;
      if (Userid) {
        const {
          data: { messages },
        } = await axios.get(
          `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
        );
        dispatch({type: reducerCases.SET_MESSAGES, messages});
      }  
    };

    if (
      currentChatUser &&
      userContacts.findIndex((contact) => contact.id === currentChatUser.id) !==
        -1
    ) {
      getMessages();
    }

    // if (currentChatUser?.id) {
    //   getMessages();
    // }
  }, [currentChatUser]);

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList></ChatList>
        {currentChatUser ? 
        <div className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}>
          <Chat></Chat> 
          {/* {console.log(messagesSearch)} */}
         {messagesSearch && <SearchMessages></SearchMessages>} 
         {/* {console.log(userInfo)} */}
        </div>
        : <Empty></Empty>}
      </div>
    </>
  );
}

export default Main;
