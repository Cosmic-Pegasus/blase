import React, { useRef, useState } from "react";
import "./CSS/RotatingTape.css";

const RotatingTape = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="compact-disc-container">
      <img
        src="/disc.png"
        alt="Music Disc"
        className={`disc ${isPlaying ? "rotate" : ""}`}
      />
      <button className="play-pause-btn" onClick={togglePlayPause}>
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <audio ref={audioRef} src="/song.mp3" loop />
    </div>
  );
};

export default RotatingTape;
