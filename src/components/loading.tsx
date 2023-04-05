export const LoadingSpinner = (props: { size?: number }) => {
  return (
    <div role="status">
      <div className="border-l-2 border-[#1a5cff] rounded-full animate-spin" 
        style={{
          width: props.size ?? 30,
          height: props.size ?? 30 
        }} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoadingSpinner size={60} />
    </div>
  )
}