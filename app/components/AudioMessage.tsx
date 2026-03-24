import { useEffect, useRef, useState } from "react";

interface AudioMessageProps {
  src: string;
}

export default function AudioMessage({ src }: AudioMessageProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playBtnRef = useRef<HTMLButtonElement | null>(null);
  const seekRef = useRef<HTMLInputElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);

  const [totalDuration, setTotalDuration] = useState<string>("0:00");

  const formatTime = (sec: number) => {
    if (isNaN(sec)) return "0:00";
    const mm = Math.floor(sec / 60);
    const ss = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    const btn = playBtnRef.current;
    const seek = seekRef.current;
    const time = timeRef.current;

    if (!audio || !btn || !seek || !time) return;

    /** Update full duration once loaded */
    const onMetaLoad = () => {
      setTotalDuration(formatTime(audio.duration));
    };

    /** Play/Pause */
    const togglePlay = () => {
      if (audio.paused) {
        audio.play();
        btn.classList.add("paused");
      } else {
        audio.pause();
        btn.classList.remove("paused");
      }
    };

    /** Update seek + current time */
    const handleTimeUpdate = () => {
      if (!audio.duration) return;

      // slider %
      seek.value = ((audio.currentTime / audio.duration) * 100).toString();

      // current time
      const formattedTime = formatTime(audio.currentTime);
      time.textContent = `${formattedTime} / ${totalDuration}`;
    };

    /** Seek */
    const handleSeek = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!audio.duration) return;

      const val = Number(target.value);
      audio.currentTime = (val / 100) * audio.duration;
    };

    /** Reset on end */
    const onEnd = () => {
      btn.classList.remove("paused");
      seek.value = "0";
      time.textContent = `0:00 / ${totalDuration}`;
    };

    btn.addEventListener("click", togglePlay);
    seek.addEventListener("input", handleSeek);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("loadedmetadata", onMetaLoad);

    return () => {
      btn.removeEventListener("click", togglePlay);
      seek.removeEventListener("input", handleSeek);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("loadedmetadata", onMetaLoad);
    };
  }, [totalDuration]);

  return (
    <div className="wa-audio">
      <audio ref={audioRef} className="wa-audio-tag" src={src} />

      <button ref={playBtnRef} className="wa-play"></button>

      <input ref={seekRef} type="range" className="wa-seek" defaultValue={0} />

      <span ref={timeRef} className="wa-time">
        0:00 / {totalDuration}
      </span>
    </div>
  );
}
