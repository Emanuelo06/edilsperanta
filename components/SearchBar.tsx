import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <form className="flex items-center w-full bg-gradient-to-r from-white to-blue-50 rounded-lg border-2 border-blue-200 focus-within:border-blue-500 focus-within:shadow-lg transition-all duration-300 overflow-hidden shadow-md">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Caută produse, branduri, categorii..."
          className="w-full pl-10 pr-4 py-3 border-none bg-transparent focus:ring-0 text-base placeholder:text-blue-400"
          aria-label="Caută produse"
        />
      </div>
      <Button type="submit" className="h-full px-6 rounded-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
        Caută
      </Button>
    </form>
  );
}
