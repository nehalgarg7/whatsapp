import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import {handleFile} from "@/utils/FileLogic";

function ChatHeader() {

  const [{currentChatUser, userInfo, onlineUsers, messages},dispatch] = useStateProvider();
 
  const [contextMenuCordinates,setContextMenuCordinates]= useState({
    x:0,
    y:0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible]= useState(false);

  const showContextMenu = (e)=>{
    e.preventDefault();
    setContextMenuCordinates({x: e.pageX-50, y: e.pageY + 20});
    setIsContextMenuVisible(true);
  };


  const fileDownload = function (filename, text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(a.href);
  }

  const contextMenuOptions = [
    {
      name:"Exit",
      callback: async()=>{
        setIsContextMenuVisible(false);
        dispatch({type: reducerCases.SET_EXIT_CHAT });
      },
    },
    {
      name:"Export Chat",
      callback: async()=>{
        const data = await handleFile({messages}, {currentChatUser}, {userInfo});
        const filename = 'save.txt';
        fileDownload(filename, data);
        //await handleFile({messages}, {currentChatUser}, {userInfo});

        setIsContextMenuVisible(false);
      },
    },
  ];

  // console.log(data);

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        {/* {console.log(currentChatUser)} */}
        <Avatar type="sm" image={currentChatUser?.profilePicture}></Avatar>
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          <span className="text-secondary text-sm">
            {
              onlineUsers.includes(currentChatUser.id) ? "online": "offline"
            }
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall className="text-panel-header-icon cursor-pointer text-xl"></MdCall>
        <IoVideocam className="text-panel-header-icon cursor-pointer text-xl"></IoVideocam>
        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" 
        onClick={()=>dispatch({ type: reducerCases.SET_MESSAGE_SEARCH})}></BiSearchAlt2>
        <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl"
        onClick={(e)=>showContextMenu(e)}
        id="context-opener"
        ></BsThreeDotsVertical>
        {isContextMenuVisible && (
          <ContextMenu
          options={contextMenuOptions}
          coordinates= {contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
