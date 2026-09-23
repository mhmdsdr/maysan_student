import { Star } from 'lucide-react'

export default function StarRating({ rating, count, size = 'sm' }) {
  const sizeMap = {
    sm: { text: 'text-xs', icon: 14 },
    md: { text: 'text-sm', icon: 16 },
    lg: { text: 'text-base', icon: 18 },
  }
  const s = sizeMap[size] || sizeMap.sm

  return (
    <div className={`flex items-center gap-1 ${s.text}`}>
      <Star size={s.icon} className="text-amber-400 fill-amber-400" />
      <span className="font-bold text-gray-800">{rating}</span>
      {count !== undefined && (
        <span className="text-gray-400">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
