import React from 'react'
import { useLoading } from './Context.jsx';

const Loading = () => {
  const { loading } = useLoading();
  if (!loading) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-1000">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-medium">Loading...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading