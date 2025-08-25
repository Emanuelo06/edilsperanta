import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <form className="flex items-center w-full bg-white rounded-lg border-2 border-gray-200 focus-within:border-primary transition-colors overflow-hidden">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Caută produse, branduri, categorii..."
          className="w-full pl-10 pr-4 py-3 border-none bg-transparent focus:ring-0 text-base placeholder:text-gray-500"
          aria-label="Caută produse"
        />
      </div>
      <Button type="submit" className="h-full px-6 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold">
        Caută
      </Button>
    </form>
  );
}
