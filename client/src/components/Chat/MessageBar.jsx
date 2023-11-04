import { useStateProvider } from "@/context/StateContext";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { reducerCases } from "@/context/constants";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../common/PhotoPicker";
import CaptureAudio from "../common/CaptureAudio";

function MessageBar() {

  const [{userInfo, currentChatUser, socket},dispatch] = useStateProvider();
  // console.log(currentChatUser);
  // console.log(userInfo);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker]=useState(false);
  const emojiPickerRef= useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder,setshowAudioRecorder] = useState();

  const photoPickerChange = async (e) => {
      // alert("working");
      // console.log(e.target.files[0]);
      const file = e.target.files[0];
      try {
        const formData =new FormData();
        formData.append("image",file);
        const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE,formData,{
          headers:{
            "Content-Type" : "multipart/form-data",
          },
          params:{
            from :userInfo.id,
            to: currentChatUser.id,
          }
        });
        if(response.status===201){
          socket.current.emit("send-msg", {
            to: currentChatUser?.id,
            from: userInfo?.id,
            message: response.data.message,
          });
    
          // console.log("Hisndwnd0"); //for error
          dispatch({
            type: reducerCases.ADD_MESSAGE,
            newMessage: {
              ...response.data.message,
            },
            fromSelf: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  useEffect(()=>{
    const handleOutsideClic =(event)=>{
      if(event.target.id!=="emoji-open"){
        if(emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)){
          setShowEmojiPicker(false);
        }
      }
    }
    document.addEventListener("click",handleOutsideClic);
    return ()=>{
      document.removeEventListener("click",handleOutsideClic);

    }
  },[])

  const handleEmojiModel = ()=>{
    // alert(true);
      setShowEmojiPicker(!showEmojiPicker);
  }

  const handleEmojiClick = (emoji)=>{
    setMessage((prevMessage)=>(prevMessage +=emoji.emoji));
  }

  const sendMessage = async() => {
    // alert("Hi")
    try {
      console.log("Enter");
      const {data} = await axios.post(ADD_MESSAGE_ROUTE,{
        to: currentChatUser?.id,
        from: userInfo?.id,
        message,
      });

      // console.log(data.message)
      console.log(currentChatUser?.id)
      console.log(userInfo?.id)

      //console.log(socket);
      console.log(socket.current); //error here
      
      //Error occured here.
      socket.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      });

      console.log("Hisndwnd0"); //for error
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
      
      setMessage("");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
            id="emoji-open"
            onClick={handleEmojiModel}
          ></BsEmojiSmile>
          {showEmojiPicker && <div className="absolute bottom-24 left-16 z-40"
          ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark"></EmojiPicker>
            </div>}
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach File"
            onClick={()=>setGrabPhoto(true)}
          ></ImAttachment>
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            onChange={(e)=>setMessage(e.target.value)}
            value = {message}
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button>
            {
            message.length? (
            <MdSend className="text-panel-header-icon cursor-pointer text-xl" title="Send message"
            onClick={sendMessage}
            ></MdSend>
            ) : (
            <FaMicrophone
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Record"
            oncClick={()=> setshowAudioRecorder(true)}></FaMicrophone>
          )}
          </button>
        </div>
      </>
      {grabPhoto && <PhotoPicker onChange={photoPickerChange}></PhotoPicker>}
      {showAudioRecorder && <CaptureAudio onChange={setshowAudioRecorder}></CaptureAudio>}
    </div>
  );
}

export default MessageBar;
