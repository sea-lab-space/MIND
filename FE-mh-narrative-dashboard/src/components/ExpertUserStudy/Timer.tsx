import { useEffect, useState } from "react";

interface TimerProps {
  totalLength: number; // total seconds to count down from
  terminate: boolean; // if true, timer should stop/reset
  onTerminate: () => void; // callback when timer reaches 0
}

export default function Timer({
  totalLength,
  terminate,
  onTerminate,
}: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalLength);

  useEffect(() => {
    if (terminate) {
      setSecondsLeft(totalLength);
      return;
    }

    if (secondsLeft <= 0) {
      onTerminate();
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft, terminate, totalLength, onTerminate]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

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
      title="Countdown Timer"
    >
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}
