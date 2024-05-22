import { useStateProvider } from "@/context/StateContext";
import index from "@/pages";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState, useRef } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";

const VoiceMessage = dynamic(()=> import("./VoiceMessage"),{
  ssr: false,
});

function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();
  const [loaded, setLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setLoaded(true); // Mark messages as loaded when component mounts
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  };

  
 // console.log(messages, currentChatUser, userInfo)
  return (
    <div className={`h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar ${loaded ? 'block' : 'hidden'} `}>
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {
              // if(messages) {
              //   console.log("hi");
              // }
            messages?.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                }`}
                
                
              >
                {/* {console.log(message.senderId, currentChatUser)} */}
                {message.type === "text" && (
                  <>
                    <div
                      className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                        message.senderId === currentChatUser.id
                          ? "bg-incoming-backgound"
                          : "bg-outgoing-background"
                      }`}
                    >
                      <span className="break-all">{message.message}</span>
                      <div className="flex gap-1 items-end">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                          {calculateTime(message.createdAt)}
                        </span>
                        <span>
                          {message.senderId === userInfo.id && (
                            <MessageStatus
                              messageStatus={message.messageStatus}
                            ></MessageStatus>
                            
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {
                  //display image msg
                  message.type==="image" && <ImageMessage message={message}></ImageMessage>
                }
                {/* not real-time updating of message status */}
                {message.type==="audio" && <VoiceMessage message={message}></VoiceMessage>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
