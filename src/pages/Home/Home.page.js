import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import styles from "./Home.module.css";

export const Home = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className={styles.container}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "#1a1a1a" } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 300, links: { opacity: 0.7 } },
              push: { quantity: 6 },
            },
          },
          particles: {
            color: { value: "#00d4ff" },
            links: {
              enable: true,
              distance: 200,
              color: "#00d4ff",
              opacity: 0.4,
              width: 2,
            },
            move: {
              enable: true,
              speed: 2,
              outModes: { default: "bounce" },
            },
            number: { value: 80, density: { enable: true, area: 800 } },
            opacity: { value: 0.6 },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 5 } },
          },
          detectRetina: true,
        }}
        className={styles.particles}
      />

      <div className={styles.content}>
        <div className={styles.heroSection}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>ResQ</h1>
            <div className={styles.subtitle}>Emergency Response System</div>
          </div>
          
          <p className={styles.description}>
            Advanced AI-powered incident detection system that monitors video streams 
            in real-time to automatically identify emergencies and dispatch help when seconds count.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🚨</span>
              <span>Real-time Detection</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <span>Instant Response</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🛡️</span>
              <span>AI-Powered Safety</span>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <NavLink to="/live" className={styles.beginButton}>
              <span>Live Cameras</span>
              <span className={styles.buttonIcon}>📹</span>
            </NavLink>
            <NavLink to="/demo" className={styles.beginButton}>
              <span>Demo Clips</span>
              <span className={styles.buttonIcon}>🎬</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
