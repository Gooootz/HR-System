import { useEffect, useState } from "react";

export const RunningTime = () => {
  const [time, setTime] = useState(new Date());
  const date = new Date();
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex text-sm text-gray-500 ">
      <p>
        Summary as of {date.toLocaleDateString()}, {time.toLocaleTimeString()}
      </p>
    </div>
  );
};
