export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-16 text-gray-600">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
        <div className="xs:col-span-2 md:col-span-1">
          <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">EdilSperanța</h3>
          <p className="text-xs sm:text-sm leading-tight">Totul pentru casa și construcții.</p>
        </div>
        <div className="flex flex-col gap-1 sm:gap-2">
          <a href="/about" className="hover:text-primary text-xs sm:text-sm">Despre</a>
          <a href="/contact" className="hover:text-primary text-xs sm:text-sm">Contact</a>
          <a href="/terms" className="hover:text-primary text-xs sm:text-sm">Termeni</a>
          <a href="/privacy" className="hover:text-primary text-xs sm:text-sm">Confidențialitate</a>
        </div>
        <div className="text-xs sm:text-sm xs:text-right md:text-left flex flex-col justify-end xs:col-span-2 md:col-span-1">
          <span className="leading-tight">&copy; {new Date().getFullYear()} EdilSperanța. 
            <span className="hidden xs:inline"> Toate drepturile rezervate.</span>
            <span className="xs:hidden block">Toate drepturile rezervate.</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
