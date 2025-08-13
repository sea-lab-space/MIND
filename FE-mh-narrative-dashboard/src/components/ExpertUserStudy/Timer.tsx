import { useEffect, useState } from "react";

interface TimerProps {
  totalLength: number; // total seconds to count up to
  terminate: boolean; // if true, timer should stop/reset
  onTerminate: () => void; // callback when timer reaches totalLength
}

export default function Timer({
  totalLength,
  terminate,
  onTerminate,
}: TimerProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (terminate) {
      setSecondsElapsed(0); // reset if terminate is true
      return;
    }

    if (secondsElapsed >= totalLength) {
      onTerminate(); // notify parent timer finished
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsElapsed, terminate, totalLength, onTerminate]);

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        padding: "6px 12px",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        fontWeight: "bold",
        borderRadius: 6,
        fontFamily: "monospace",
        cursor: "default",
        userSelect: "none",
        transition: "background-color 0.3s ease",
        zIndex: 9999,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(0,0,0,0.85)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(0,0,0,0.6)";
      }}
      title="Timer"
    >
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}
