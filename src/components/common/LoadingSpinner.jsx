export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#F0FDF9] flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-teal-100 border-t-[#0D9488] animate-spin" />
      <p className="text-[#0D9488] font-semibold text-sm">جاري التحميل...</p>
    </div>
  )
}
