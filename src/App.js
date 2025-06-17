// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import styles from "./App.module.css";
import { Home } from "./pages/Home/Home.page";
import { Stream } from "./pages/streams/Stream.page";
import { SideBar } from "./pages/SideBar/SideBar.page";

export const NavBar = () => (
  <nav className={styles.nav}>
    <NavLink
      to="/"
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.active : ""}`
      }
    >
      <h1 className={styles.navTitle}>ResQ</h1>
    </NavLink>
    <div className={styles.links}>
      <NavLink
        to="/live"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        Live
      </NavLink>
      <NavLink
        to="/demo"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        Demo
      </NavLink>
    </div>
  </nav>
);

function App() {
  const [accidents, setAccidents] = useState([]);

  const handleAnalyze = (payload) => {
    const obj = {
      title: "Accident on " + payload.stream_id,
      time: new Date(payload.timestamp)
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase()
        .replace(/\s/g, ""),
      location: payload.location,
      description: payload.description,
      key: payload.stream_id,
      logs: [
        {
          type: "command",
          source: "detect",
          message: `Detecting accident on stream ${payload.stream_id}...`,
        },
        {
          type: "output",
          source: "cnfrm",
          message: `Accident detected at ${payload.timestamp} on ${payload.location}`,
        },
        {
          type: "output",
          source: "action",
          message: "Dialing local emergency services...",
        },
      ],
    };
    setAccidents((prev) => [obj, ...prev]);

    // After 20 seconds, append "Call completed, help on the way" to the logs
    setTimeout(() => {
      setAccidents((prevAccidents) =>
        prevAccidents.map((acc) =>
          acc.key === payload.stream_id
            ? {
                ...acc,
                logs: [
                  ...acc.logs,
                  {
                    type: "output",
                    source: "action",
                    message: "Call completed, help on the way",
                  },
                ],
              }
            : acc
        )
      );
    }, 20000);
  };

  return (
    <Router>
      <NavBar />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/live"
            element={
              <>
                <Stream onAnalyze={handleAnalyze} accidents={accidents} streamType="live" />
                <SideBar accidents={accidents} />
              </>
            }
          />
          <Route
            path="/demo"
            element={
              <>
                <Stream onAnalyze={handleAnalyze} accidents={accidents} streamType="demo" />
                <SideBar accidents={accidents} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
