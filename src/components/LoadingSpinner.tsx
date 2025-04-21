
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0;
        }
        return prevProgress + 10;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-lg">Cargando</span>
      <Progress value={progress} className="w-[360px] h-[3px]" />
    </div>
  );
};

export default LoadingSpinner;
