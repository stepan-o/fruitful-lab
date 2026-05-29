"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const podcastEpisodes = [
  {
    fullTitle: "Incense and Florals: Exploring Ancient Practices and Modern Creations",
    title: "Incense and Florals",
    subtitle: "Exploring Ancient Practices and Modern Creations",
    body: "With Alisa of Flora Botanical Incense",
    icon: "incense",
    durationSeconds: 2692,
    audioUrl: "https://audio2.redcircle.com/episodes/3c7774ef-24bb-4963-a4ca-9171b6c9e53d/stream.mp3",
  },
  {
    fullTitle: "Forest Therapy: Elizabeth Mintun on Nature's Healing Power",
    title: "Forest Therapy",
    subtitle: "Elizabeth Mintun on Nature's Healing Power",
    body: "Forest bathing, mindfulness, and psychological health",
    icon: "forest",
    durationSeconds: 2519,
    audioUrl: "https://audio2.redcircle.com/episodes/955faaeb-c403-468d-8da3-3c7399e7859c/stream.mp3",
  },
  {
    fullTitle: "Harnessing Flower Energy: Healing with Yvette Timmins",
    title: "Harnessing Flower Energy",
    subtitle: "Healing with Yvette Timmins",
    body: "Flower energy with sunflowers, roses, and healing practice",
    icon: "flower",
    durationSeconds: 2502,
    audioUrl: "https://audio2.redcircle.com/episodes/88477bb4-8da0-4b04-a585-32c59e97e896/stream.mp3",
  },
] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "00:00";
  }

  const rounded = Math.floor(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function PodcastEpisodeIcon({ type }: { type: (typeof podcastEpisodes)[number]["icon"] }) {
  if (type === "forest") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M15.5 36V18.5" />
        <path d="M24 38V12" />
        <path d="M32.5 36V20" />
        <path d="M11 31c3.9-1.4 7-5.4 7-10.2c0-3.4-1.6-6.5-4.1-8.4C11.4 14.3 9.8 17.4 9.8 20.8C9.8 25.6 12.2 29.6 15.5 31Z" />
        <path d="M20 31.2c5.3-2.1 8.3-7.9 6.7-13.9A16.7 16.7 0 0 0 24 11.5a16.7 16.7 0 0 0-2.7 5.8C19.7 23.3 21.5 28.3 24 31.2Z" />
        <path d="M29.8 31c3.4-1.4 6-5.1 6-9.6c0-3.2-1.4-6.1-3.6-7.9c-2.2 1.8-3.6 4.7-3.6 7.9c0 4.5 1.5 8.2 3.9 9.6Z" />
        <path d="M10 38.5h28" />
      </svg>
    );
  }

  if (type === "flower") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M24 24.3c3.4-3.2 3.5-8.8 0-12.2c-3.5 3.4-3.4 9 0 12.2Z" />
        <path d="M23.8 24.1c-4.7-1.4-9.3 1.4-10.6 6.2c4.8 1.2 9.3-1.5 10.6-6.2Z" />
        <path d="M24.2 24.1c4.7-1.4 9.3 1.4 10.6 6.2c-4.8 1.2-9.3-1.5-10.6-6.2Z" />
        <path d="M24 24v13.6" />
        <path d="M18 37.6h12" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="M17 28.5h14l-1.8 10.2H18.8L17 28.5Z" />
      <path d="M20.1 28.5c0-2.4 1.7-4.1 3.9-4.1s3.9 1.7 3.9 4.1" />
      <path d="M18.5 38.7h11" />
      <path d="M20 20.5c-2.5-2.7-2.5-6 0-8.7c2.4 2.6 2.4 6.1 0 8.7Z" />
      <path d="M24.1 18.5c-2.3-3.5-1.5-7.3 2.2-10.2c1.2 4.3.4 7.5-2.2 10.2Z" />
      <path d="M27.8 21.4c1.7-2.7 4.2-4 7.4-3.9c-.7 3.4-3 5.5-7.4 3.9Z" />
    </svg>
  );
}

export function PodcastPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(podcastEpisodes[0].durationSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const shouldPlayAfterSelectRef = useRef(false);

  const currentEpisode = podcastEpisodes[currentEpisodeIndex];
  const progress = useMemo(() => {
    const resolvedDuration = duration || currentEpisode.durationSeconds;
    return resolvedDuration > 0 ? Math.min((currentTime / resolvedDuration) * 100, 100) : 0;
  }, [currentEpisode.durationSeconds, currentTime, duration]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.load();
    const shouldPlay = shouldPlayAfterSelectRef.current;
    shouldPlayAfterSelectRef.current = false;

    if (!shouldPlay) {
      return;
    }

    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentEpisode.audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const selectEpisode = (episodeIndex: number, playAfterSelect = true) => {
    if (episodeIndex === currentEpisodeIndex) {
      if (playAfterSelect) {
        togglePlay();
      }
      return;
    }

    shouldPlayAfterSelectRef.current = playAfterSelect;
    setCurrentTime(0);
    setDuration(podcastEpisodes[episodeIndex].durationSeconds);
    setIsPlaying(false);
    setCurrentEpisodeIndex(episodeIndex);
  };

  const skipBy = (seconds: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextTime = Math.max(0, Math.min(audio.currentTime + seconds, duration || currentEpisode.durationSeconds));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const selectRelativeEpisode = (offset: number) => {
    const nextIndex = (currentEpisodeIndex + offset + podcastEpisodes.length) % podcastEpisodes.length;
    selectEpisode(nextIndex, isPlaying);
  };

  const seek = (event: React.MouseEvent<HTMLButtonElement>) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    const nextTime = Math.max(0, Math.min(ratio, 1)) * (duration || currentEpisode.durationSeconds);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <>
      <div className="podcast-copy">
        <p className="eyebrow light">
          <span aria-hidden="true">✦</span>
          The Podcast
        </p>
        <h2>Conversations from the garden</h2>
        <p>
          Stories, symbolism, and practical ways to bring flowers into life, art, food, and everyday rituals, one
          episode at a time.
        </p>
        <div className="podcast-actions" aria-label="Podcast actions">
          <button className="podcast-button podcast-button--primary" type="button" onClick={togglePlay}>
            <span aria-hidden="true">✦</span>
            {isPlaying ? "Pause the Podcast" : "Listen to the Podcast"}
          </button>
          <Link className="podcast-button podcast-button--secondary" href="#podcast-episodes">
            Browse Episodes
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
        <p className="podcast-platform-note">
          <span className="podcast-headphone-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M4.75 13.2v-1.4a7.25 7.25 0 0 1 14.5 0v1.4" />
              <path d="M7.5 12h-.7A1.8 1.8 0 0 0 5 13.8v2A1.8 1.8 0 0 0 6.8 17.6h.7V12Z" />
              <path d="M16.5 12h.7a1.8 1.8 0 0 1 1.8 1.8v2a1.8 1.8 0 0 1-1.8 1.8h-.7V12Z" />
            </svg>
          </span>
          Listen on <span>Spotify</span> or <span>Apple Podcasts</span>.
        </p>
      </div>

      <div className="podcast-player-card" aria-label="Bloom Whispers podcast player">
        <audio
          ref={audioRef}
          className="podcast-audio"
          preload="none"
          src={currentEpisode.audioUrl}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || currentEpisode.durationSeconds)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        >
          <a href={currentEpisode.audioUrl}>Listen to {currentEpisode.fullTitle}</a>
        </audio>

        <div className="podcast-cover">
          <Image
            src="/assets/podcast-cover-t1-e1.png"
            alt="Bloom Whispers podcast cover"
            fill
            sizes="(max-width: 900px) 78vw, 370px"
          />
        </div>
        <div className="podcast-player-copy">
          <h3>{currentEpisode.title}</h3>
          <p>{currentEpisode.subtitle}</p>
        </div>
        <div className="podcast-progress" aria-label={`${currentEpisode.fullTitle} playback progress`}>
          <span>{formatTime(currentTime)}</span>
          <button
            className="podcast-progress-track"
            type="button"
            onClick={seek}
            aria-label={`Seek ${currentEpisode.title}`}
            style={{ "--podcast-progress": `${progress}%` } as CSSProperties}
          >
            <i style={{ left: `${progress}%` }} />
          </button>
          <span>{formatTime(duration || currentEpisode.durationSeconds)}</span>
        </div>
        <div className="podcast-controls">
          <button className="podcast-skip" type="button" onClick={() => skipBy(-15)} aria-label="Rewind 15 seconds">
            15
          </button>
          <button className="podcast-control-icon" type="button" onClick={() => selectRelativeEpisode(-1)} aria-label="Previous episode">
            |&lt;
          </button>
          <button className="podcast-play" type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause episode" : "Play episode"}>
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button className="podcast-control-icon" type="button" onClick={() => selectRelativeEpisode(1)} aria-label="Next episode">
            &gt;|
          </button>
          <button className="podcast-skip" type="button" onClick={() => skipBy(15)} aria-label="Forward 15 seconds">
            15
          </button>
        </div>
      </div>

      <div className="podcast-episode-area" id="podcast-episodes">
        <p className="podcast-episodes-label">
          <span aria-hidden="true">✦</span>
          Featured episodes
        </p>
        <div className="podcast-episode-list">
          {podcastEpisodes.map((episode, index) => {
            const isCurrentEpisode = index === currentEpisodeIndex;

            return (
              <article
                className={`podcast-episode-card${isCurrentEpisode ? " podcast-episode-card--active" : ""}`}
                key={episode.fullTitle}
              >
                <div className="podcast-episode-art" aria-hidden="true">
                  <PodcastEpisodeIcon type={episode.icon} />
                </div>
                <div>
                  <h3>{episode.title}</h3>
                  <p className="podcast-episode-subtitle">{episode.subtitle}</p>
                  <p>{episode.body}</p>
                </div>
                <button
                  className="podcast-episode-play"
                  type="button"
                  onClick={() => selectEpisode(index)}
                  aria-label={`${isCurrentEpisode && isPlaying ? "Pause" : "Play"} ${episode.fullTitle}`}
                >
                  {isCurrentEpisode && isPlaying ? "❚❚" : "▶"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
