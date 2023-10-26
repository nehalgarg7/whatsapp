import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
function login() {
  const router = useRouter();
  const handlelogin = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider);
    try {
      if(email)
      {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        console.log({data});
        if (!data.status) {
          router.push("/onboarding");
        }
      }    
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp"
          height={300}
          width={300}
        ></Image>
        <span className="text-7xl">Whatsapp</span>
      </div>
      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
        onClick={handlelogin}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white" text-2xl>
          Login with Google
        </span>
      </button>
    </div>
  );
}

export default login;
