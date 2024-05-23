import React, { useState, useEffect, useRef } from "react";
import "./MessageAudio.css";

const MessageAudio = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio object here to properly handle src updates
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    console.log(src)
    audio.src = src; // Update src whenever it changes

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    // Play/Pause state
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error attempting to play audio:", error);
        });
      }
    } else {
      audio.pause();
    }

    // Cleanup on unmount or src change
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.pause(); // Optionally pause audio on cleanup
    };
  }, [isPlaying, src]);

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Format time to display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  };

  // Calculate the progress as percentage
  const progress = (currentTime / duration) * 100;

  // SVG icons
  const playIcon = (
    <svg viewBox="0 0 24 24" height="24px" width="24px">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const pauseIcon = (
    <svg viewBox="0 0 24 24" height="24px" width="24px">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );

  return (
    <div className="custom-audio-player">
      <button onClick={togglePlayPause} className="play-pause-btn">
        {isPlaying ? pauseIcon : playIcon}
      </button>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="time">{formatTime(duration - currentTime)}</div>
    </div>
  );
};

export default MessageAudio;
