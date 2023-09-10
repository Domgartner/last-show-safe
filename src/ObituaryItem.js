import React, { useEffect, useState } from "react";

function ObituaryItem({ obituary, index, mostRecentObituary }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDescription, setShowDescription] = useState(mostRecentObituary.id === obituary.id);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    audioUrl.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    audioUrl.pause();
    setIsPlaying(false);
  };

  const handlePlayPauseClick = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  useEffect(() => {
    setAudioUrl(new Audio(obituary.pollyurl));
  }, [obituary.pollyurl]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (audioUrl) {
      audioUrl.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }
    return () => {
      if (audioUrl) {
        audioUrl.removeEventListener("ended", () => {
          setIsPlaying(false);
        });
      }
    };
  }, [audioUrl]);

  return (
    <div
      className={`obituary-item ${isLoaded ? 'fade-in' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => setShowDescription(!showDescription)} >
      <img src={obituary.imageURL} alt={obituary.name} onLoad={() => setIsLoaded(true)} />
      <h2>{obituary.name}</h2>
      <p>
        {formatDate(obituary.born)} - {formatDate(obituary.died)}
      </p>
      <br />
      <div className={`description-container ${showDescription ? 'fade-in' : ''}`}>
        {showDescription && (
          <>
            <p className="description">{obituary.desc}</p>
            <div className="audio-container">
              <audio
                src={obituary.pollyurl}
                onPlay={() => {
                  setIsPlaying(true);
                  setAudioUrl(new Audio(obituary.pollyurl));
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => handleAudioEnded()}>
                Your browser does not support the audio element.
              </audio>
             <button className="play-pause-button" onClick={(e) => handlePlayPauseClick(e)}>
               {isPlaying ? (
                 <span id = "pauserline" role="img" aria-label="Pause">| |</span>
               ) : (
                 <span id="playimg" role="img" aria-label="Play">&#9654;</span>
               )}
             </button>
           </div>
         </>
        )}
      </div>
    </div>
  );
}

export default ObituaryItem;
