import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";
import { HOST} from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
  //console.log(message);
  // if message.message[0] === 'h' &&& message.message[1] === 't', then URL = message.message otherwise URL = ${HOST}/${message.message}

  let URL = "";

  if (message.message[0] === 'h' && message.message[1] === 't') 
    {
      URL = message.message;
    }
  else
  {
    URL = `${HOST}/${message.message}`;
  }


  const [{ currentChatUser, userInfo }] = useStateProvider();
  return ( 
  <div className={`p-1 rounded-lg ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
    <div className="relative">
      <Image src={`${URL}`}
        className="rounded-lg"
        alt="asset"
        height={300}
        width={300}
      ></Image>
      <div className="absolute bottom-1 right-1 flex items-end gap-1">
        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
          {calculateTime(message.createdAt)}
        </span>
        <span className="text-bubble-meta">
        { message.senderId === userInfo.id && (
          <MessageStatus messageStatus={message.messageStatus}></MessageStatus>
        )}
        {/* {console.log(message.messageStatus)} */}
        </span>
      </div>
    </div>
  </div>
  );
}

export default ImageMessage;
