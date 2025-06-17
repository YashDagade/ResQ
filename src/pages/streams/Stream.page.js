// src/pages/Stream/Stream.page.js
import React, { useEffect, useState, useRef } from "react";
import styles from "./Stream.module.css";
import { call, getStreams } from "../../api/routes";

export const Stream = ({ onAnalyze, accidents }) => {
  const [streamsList, setStreamsList] = useState([]);
  const [currentFrames, setCurrentFrames] = useState({});
  const [fps, setFps] = useState({});
  const [glowingStreams, setGlowingStreams] = useState({}); // id → boolean

  const socketsRef = useRef({});
  const timesRef = useRef({});
  const prevAccidentKeys = useRef([]);

  // 1) fetch streams once
  useEffect(() => {
    getStreams()
      .then((data) => data.streams && setStreamsList(data.streams))
      .catch((err) => console.error("getStreams error", err));
  }, []);

  // 2) open a socket per stream when it first appears
  useEffect(() => {
    streamsList.forEach(({ id }) => {
      if (socketsRef.current[id]) return;

      const ws = new WebSocket(`wss://cdbackend.onrender.com/ws/stream/${id}`);
      const as = new WebSocket(`wss://cdbackend.onrender.com/ws/analyze/${id}`);
      socketsRef.current[id] = { ws, as };

      ws.addEventListener("open", () =>
        console.log(`WS for stream ${id} opened`)
      );
      ws.addEventListener("message", ({ data }) => {
        const payload = JSON.parse(data);
        console.log(payload);
        if (payload.type !== "frame") return;

        const { stream_id, frame } = payload;
        const dataUrl = `data:image/jpeg;base64,${frame}`;

        // FPS calculation
        const now = Date.now();
        const arr = timesRef.current[stream_id] || [];
        arr.push(now);
        const cutoff = now - 1000;
        const recent = arr.filter((t) => t >= cutoff);
        timesRef.current[stream_id] = recent;
        setFps((prev) => ({ ...prev, [stream_id]: recent.length }));

        // pre-load image
        const img = new Image();
        img.onload = () =>
          setCurrentFrames((prev) => ({ ...prev, [stream_id]: dataUrl }));
        img.onerror = () =>
          console.warn(`Failed to load frame for ${stream_id}`);
        img.src = dataUrl;
      });
      ws.addEventListener("error", (e) =>
        console.error(`WebSocket error on ${id}:`, e)
      );

      as.addEventListener("open", () =>
        console.log(`AS for events ${id} opened`)
      );
      as.addEventListener("message", ({ data }) => {
        const payload = JSON.parse(data);
        if (payload.type === "accident_alert") {
          let prompt = `You are a caller informing 911 operator about the following accident. You must be brief, concise, and get all information across: You have access to the following information: ${payload.description}`;

          onAnalyze({
            ...payload,
            logs: [
              ...(payload.logs || []),
              {
                type: "output",
                source: "action",
                message: "Dialing local emergency services...",
              },
            ],
          });

          call(prompt, "111");
        }
      });
      as.addEventListener("error", (e) =>
        console.error(`Analyze socket error on ${id}:`, e)
      );
    });
  }, [streamsList, onAnalyze]);

  // 3) trigger glow only for newly added accidents
  useEffect(() => {
    const prevKeys = prevAccidentKeys.current;
    const currentKeys = accidents.map((acc) => acc.key);

    const newKeys = currentKeys.filter((key) => !prevKeys.includes(key));
    newKeys.forEach((id) => {
      setGlowingStreams((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setGlowingStreams((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 2000);
    });

    prevAccidentKeys.current = currentKeys;
  }, [accidents]);

  // 4) cleanup all sockets on unmount
  useEffect(() => {
    return () => {
      Object.values(socketsRef.current).forEach(({ ws, as }) => {
        ws.close();
        as.close();
      });
      socketsRef.current = {};
    };
  }, []);

  if (!streamsList.length) {
    return <div className={styles.placeholder}>Loading streams…</div>;
  }

  return (
    <div className={styles.streamContainer}>
      {streamsList.map(({ id, location }) => (
        <div
          key={id}
          className={`${styles.stream} ${
            glowingStreams[id] ? styles.glow : ""
          }`}
        >
          <div className={styles.videoWrapper}>
            {currentFrames[id] ? (
              <img
                src={currentFrames[id]}
                alt={`Live stream ${id}`}
                className={styles.videoElement}
                onError={(e) =>
                  console.error(
                    "Image load failed:",
                    e.target.src.slice(0, 30) + "…"
                  )
                }
              />
            ) : (
              <div className={styles.placeholder}>Loading frame…</div>
            )}
            <div className={styles.gradientOverlay} />
            <div className={styles.fps}>
              {fps[id] != null ? fps[id] : "--"} FPS
            </div>
            <h3 className={styles.label}>{location}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
