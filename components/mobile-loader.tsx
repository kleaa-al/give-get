export function MobileLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center safe-area">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center shadow-lg mb-4 mx-auto">
          <span className="text-white text-2xl font-bold">G&G</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00] mx-auto"></div>
      </div>
    </div>
  )
}
