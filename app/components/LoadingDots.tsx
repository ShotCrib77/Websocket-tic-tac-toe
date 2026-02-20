export default function LoadingDots() {
  return (
    <div className="flex gap-1 items-end">
      <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
    </div>
  )
}