import { useState } from "react";

export const handleFile = (data, currentChatUser, userInfo)=>{
    const currentChatUserId = currentChatUser?.currentChatUser?.id;
    const userInfoId = userInfo?.userInfo?.id;
    let finalData = "";
    
    let counter = 1;
    const messagesArr = data?.messages;
    messagesArr?.map((obj) => {
    
        let date = new Date(obj.createdAt)
        let s = date.toLocaleString().toString().substring(0, 3) +'0' +date.toLocaleString().toString().substring(3, 10);
        let v = date.toUTCString().toString().substring(17, 22);

        if(counter === 1)
            {
                finalData += s + ' ' + v + " - " + "Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more. \n"
            }
            
        counter++;
    
        finalData += s + ' ' + v + " - ";
    
        if (obj.recieverId === currentChatUserId)
            finalData += userInfo.userInfo.name + ': ';
        else
            finalData += currentChatUser.currentChatUser.name + ': ';
    
        if (obj.type === "text")
            finalData = finalData + obj.message + '\n';
        else if (obj.type === "audio")
            finalData = finalData + "audio.mp4 " + "(file attached)" + '\n';
        else if (obj.type === "image")
            finalData = finalData + "image.jpg " + "(file attached)" + '\n';
    })
    
    //console.log(finalData);
    return finalData;   
}


