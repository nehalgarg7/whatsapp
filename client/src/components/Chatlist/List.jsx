import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";

export default function List() {
  const [{ userInfo, userContacts,contactSearch, filteredContacts }, dispatch] =
    useStateProvider();
  useEffect(() => {
    try {
      const getContacts = async () => {
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      };
      if (userInfo?.id) {
        getContacts();
      }
    } catch (err) {
      console.error(err);
    }
  }, [userInfo]);
  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {/* {
      filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => {
            return <ChatLIstItem data={contact} key={contact.id} />;
          })
        : userContacts.map((contact) => {
            return <ChatLIstItem data={contact} key={contact.id} />;
          })} */}

          {
            contactSearch === "" ? userContacts.map((contact) => {
              return <ChatLIstItem data={contact} key={contact.id} />;
            }): 
            filteredContacts && filteredContacts.length > 0 ?
            filteredContacts.map((contact) => {
              return <ChatLIstItem data={contact} key={contact.id} />;
            }) : <div className="text-center text-gray-500 py-4">
            No contacts found.
          </div>
          }

{/* {(contactSearch === "" || filteredContacts.length === 0) && (
        // Render userContacts when there's no search query or no filtered results
        userContacts.map((contact) => (
          <ChatLIstItem data={contact} key={contact.id} />
        ))
      )}
      {contactSearch !== "" &&
        filteredContacts.map((contact) => (
          <ChatLIstItem data={contact} key={contact.id} />
        ))}
      {contactSearch !== "" && filteredContacts.length === 0 && (
        // Display "No contacts found." message when there's a search query but no filtered results
        <div className="text-center text-gray-500 py-4">
          No contacts found.
        </div>
      )} */}
    </div>
  );
}
