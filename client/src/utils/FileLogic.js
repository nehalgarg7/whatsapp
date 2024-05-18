export const handleFile = (data, currentChatUser, userInfo)=>{
    const currentChatUserId = currentChatUser?.currentChatUser?.id;
    const userInfoId = userInfo?.userInfo?.id;
    let finalData = "";
    
    
    const messagesArr = data?.messages;
    messagesArr?.map((obj) => {
    
        let date = new Date(obj.createdAt)
        let s = date.toLocaleString().toString().substring(0, 10);
        let v = date.toUTCString().toString().substring(17, 22);
    
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
    
   return finalData;   
}


