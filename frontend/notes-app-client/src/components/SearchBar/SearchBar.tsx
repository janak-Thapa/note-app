// SearchBar
import React, { ChangeEvent } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  onClearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center px-2 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="flex-grow text-sm bg-transparent py-1 outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <FaTimes className="text-lg text-slate-500 cursor-pointer hover:text-black" onClick={onClearSearch} />
      )}
      <FaSearch className="text-slate-400 cursor-pointer hover:text-black" onClick={handleSearch} />
    </div>
  );
}

export default SearchBar;
