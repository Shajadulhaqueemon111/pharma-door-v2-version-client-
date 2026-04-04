import { Search } from "lucide-react";

type SearchBarProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({ searchText, setSearchText }: SearchBarProps) => {
  return (
    <div className="flex items-center justify-evenly border border-b-zinc-300 rounded-md overflow-hidden w-full max-w-md mx-auto bg-white">
      <div className="px-2 text-gray-500 shrink-0">
        <Search size={18} />
      </div>

      <input
        type="text"
        placeholder="Find Your Medicine..."
        className="flex-1 min-w-0 text-sm p-2 outline-none"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <button className="bg-[#00B8A2] hover:bg-amber-600 text-white px-2 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap shrink-0">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
