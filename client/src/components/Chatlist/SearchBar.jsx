import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { useState } from "react";
import { BiFilter, BiSearchAlt2, BiArrowBack } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { useRef } from "react";

export default function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvider();
  const inputRef = useRef(null);
  const handleClearSearch = () => {
    // Clear the contactSearch state
    dispatch({
      type: reducerCases.SET_CONTACT_SEARCH,
      contactSearch: "",
    });
  };

  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-text text-l" 
          onClick={() => inputRef.current.focus()}/>
        </div>
        <div className="flex-grow">
          <input
          ref={inputRef}
            type="text"
            placeholder="Search chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
            value={contactSearch}
            onChange={(e) =>
              dispatch({
                type: reducerCases.SET_CONTACT_SEARCH,
                contactSearch: e.target.value,
              })
            }
          />
        </div>
        {
          contactSearch && (
            <div className="hover:bg-gray-700"><RxCross2 className="text-panel-header-icon cursor-pointer text-xl" onClick={handleClearSearch}
        /></div>
          )
        }
      </div>
      <div className="pr-5 pl-3">
        <BiFilter className="text-panel-header-icon cursor-pointer text-xl "/>
      </div>
    </div>
  );
}
