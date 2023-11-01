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

function Main() {
  const router = useRouter();
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
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

      if (!data.staus) {
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

  useEffect(()=>{
    if(userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({type:reducerCases.SET_SOCKET, socket});
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
          }
        })
      })
      setSocketEvent(true)
    }

  },[socket.current]);

  useEffect(() => {
    console.log("Hi");
    const getMessages = async () => {
      let Userid = userInfo?.id;
      console.log(userInfo?.id);
      console.log(currentChatUser.data.id);
      if (Userid) {
        const {
          data: { messages },
        } = await axios.get(
          `${GET_MESSAGES_ROUTE}/${Userid}/${currentChatUser.data.id}`
        );
        console.log({ data });
        console.log({ messages });
        dispatch({type: reducerCases.SET_MESSAGES, messages});
      }  
    };

    if (currentChatUser?.data.id) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList></ChatList>
        {currentChatUser ? <Chat></Chat> : <Empty></Empty>}
      </div>
    </>
  );
}

export default Main;
