// Navbar
import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

interface UserInfo {
  fullName: string;
  email: string;
}

interface NavbarProps {
  userInfo: UserInfo | null | undefined;
  onSearchNote: (searchQuery: string) => void;
  handleClearSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="bg-white flex flex-col sm:flex-row items-center justify-between px-6 py-2">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <div className="flex flex-col sm:flex-row items-center mt-2 sm:mt-0">
        <div className="flex-shrink-0">
          <SearchBar 
            value={searchQuery}
            onChange={handleSearchChange}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>
        {userInfo !== undefined && (
          <div className="ml-0 sm:ml-4 mt-4 sm:mt-0">
            <ProfileInfo onLogout={onLogout} userInfo={userInfo} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
