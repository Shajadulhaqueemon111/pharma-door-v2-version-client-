import { Search, X } from "lucide-react";

type SearchBarProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({ searchText, setSearchText }: SearchBarProps) => {
  return (
    <div className="relative flex items-center w-full max-w-lg mx-auto bg-white border border-slate-200/80 rounded-full shadow-xs hover:border-teal-400 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all duration-200">
      <div className="pl-4 pr-2 text-slate-400 flex items-center shrink-0">
        <Search size={18} className="text-teal-600" />
      </div>

      <input
        type="text"
        placeholder="Search medicine, generics, equipments..."
        className="flex-1 min-w-0 text-xs sm:text-sm py-2 sm:py-2.5 px-1 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {searchText && (
        <button
          onClick={() => setSearchText("")}
          className="p-1 mr-1 text-slate-400 hover:text-slate-600 transition-colors"
          title="Clear search"
          type="button"
        >
          <X size={15} />
        </button>
      )}

      <button
        type="button"
        className="m-1 px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
      >
        <Search size={14} className="hidden sm:inline" />
        <span>Search</span>
      </button>
    </div>
  );
};

export default SearchBar;
