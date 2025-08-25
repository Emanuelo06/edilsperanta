import Navbar from "@/components/Navbar";

export default function TestResponsivePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Test Responsive Design" showBackButton={true} />
      
      <div className="p-2 sm:p-4 max-w-4xl mx-auto space-y-4">
        <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold mb-3">250px Responsive Test</h2>
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-primary/10 p-2 sm:p-4 rounded-lg text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/20 rounded-full mx-auto mb-1 sm:mb-2"></div>
                <p className="text-xs sm:text-sm font-medium">Item {i}</p>
                <p className="text-xs text-gray-600 hidden sm:block">Description text</p>
              </div>
            ))}
          </div>

          {/* Responsive Typography */}
          <div className="space-y-2 mb-6">
            <h3 className="text-base sm:text-lg font-semibold">Responsive Text Sizes:</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="hidden xs:inline">This text adapts from 250px screens to desktop.</span>
              <span className="xs:hidden">Short text for 250px.</span>
            </p>
            <p className="text-sm sm:text-base">Regular content that scales up from mobile to desktop.</p>
          </div>

          {/* Mobile vs Desktop UI */}
          <div className="border rounded-lg p-3">
            <h4 className="text-sm sm:text-base font-medium mb-2">Adaptive UI:</h4>
            
            {/* Mobile Layout (250px-first) */}
            <div className="sm:hidden space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Mobile Layout (250px+)</p>
                  <p className="text-xs text-gray-500">Stacked vertically</p>
                </div>
                <div className="text-xs text-primary">Action</div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="text-base font-medium">Desktop Layout</p>
                  <p className="text-sm text-gray-500">Horizontal arrangement with more space</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                Action Button
              </button>
            </div>
          </div>

          {/* Responsive Navigation */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm sm:text-base font-medium mb-2">Navigation Features:</h4>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
              <li>✓ Burger menu for mobile (tap header menu)</li>
              <li>✓ Collapsible search on mobile</li>
              <li>✓ Responsive icons and text</li>
              <li>✓ Touch-friendly 250px+ design</li>
              <li>✓ Full desktop navigation on larger screens</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
