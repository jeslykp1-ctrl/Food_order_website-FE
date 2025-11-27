import React from "react";

function LoaderDots() {
  return (
    <div className="flex items-center justify-center space-x-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-4 h-4 bg-gray-800 rounded-full animate-bounceLoader"
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>
        {`
          @keyframes bounceLoader {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          .animate-bounceLoader {
            display: inline-block;
            animation: bounceLoader 1.4s infinite ease-in-out both;
          }
        `}
      </style>
    </div>
  );
}

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <LoaderDots />
    </div>
  );
}
