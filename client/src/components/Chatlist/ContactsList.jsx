import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import ChatLIstItem from "./ChatLIstItem";
import { useRef } from "react";

function ContactsList() {
  const [allContacts, setALLContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();
  const [searchTerm, setsearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};

      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!filteredData[key].length) {
          delete filteredData[key];
        }
      });

      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchTerm]);

  useEffect(() => {
    
    const getContacts = async () => {
      try {
        let data = await axios.get(GET_ALL_CONTACTS);
        
        setALLContacts(data.data.user);
        setSearchContacts(data.data.user)
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() => {
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
            }}
          ></BiArrowBack>
          <span>New Chat</span>
        </div>
      </div>

      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2
                className="
            text-panel-header-icon
            cursor-text
            text-l"
            onClick={() => inputRef.current.focus()}
              ></BiSearchAlt2>
            </div>
            <div className="flex-grow">
            <input
            ref={inputRef}
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                onChange={(e) => setsearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>
            {
              searchTerm && (
                <div className="hover:bg-gray-700"><RxCross2 className="text-panel-header-icon cursor-pointer text-xl" onClick={()=>setsearchTerm("")}
        /></div>
              )
            }
          </div>
        </div>
        {Object.entries(searchContacts).length === 0 ? <div className="text-center text-gray-500 py-4">
          No contacts found.
        </div>: Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (  userList.length >0 && (
            <div key={Date.now() + initialLetter}>
              <div className="text-teal-light pl-10 py-5">{initialLetter} </div>
              {userList.map((contact) => {
                return (                 
                  <ChatLIstItem
                    data={contact}
                    isContactPage={true}
                    key={contact.id}
                  ></ChatLIstItem>   
                );
              })}
            </div> )
          );
        })}
        
      </div>
    </div>
  );
}

export default ContactsList;
