import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Loading() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <DotLottieReact
          src="https://lottie.host/376c2d63-c220-4987-b922-67d602ba3510/DCVf0jB4V9.lottie"
          loop
          autoplay
          style={{ width: '200px', height: '200px' }}
        />
        {showLoader && (
          <div className="mt-4 text-gray-600 text-lg">
            Checking authentication...
          </div>
        )}
      </div>
    </div>
  );
}

export default Loading;