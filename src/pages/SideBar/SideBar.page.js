// src/pages/SideBar/SideBar.page.js
import React from "react";
import styles from "./SideBar.module.css";
import { FaMapPin } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export const SideBar = ({ accidents }) => (
  <div className={styles.container}>
    <h1 className={styles.title}>Accidents</h1>
    <div className={styles.accidentContainer}>
      {accidents.length === 0 ? (
        <div className={styles.noAccidents}>No accidents detected</div>
      ) : (
        <AnimatePresence initial={false}>
          {accidents.map((acc, index) => (
            <motion.div
              key={`${acc.key}-${index}`}
              className={styles.accident}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className={styles.row}>
                <h3 className={styles.accidentTitle}>{acc.title}</h3>
                <div className={styles.timeContainer}>
                  {acc.time.slice(0, acc.time.lastIndexOf(":")) +
                    acc.time.slice(-2)}
                </div>
              </div>
              <div className={styles.location}>
                <FaMapPin />
                <span style={{ marginLeft: 4 }}>{acc.location}</span>
              </div>
              <p className={styles.description}>{acc.description}</p>
              <p className={styles.logs}>Logs:</p>
              <div className={styles.terminalContainer}>
                {acc.logs.map((log, idx) => {
                  const dur = `${(log.message.length * 0.05).toFixed(2)}s`;
                  const delay = `${(idx * 0.3).toFixed(2)}s`;
                  return (
                    <div key={idx} className={styles.terminalLine}>
                      <span className={styles.terminalPrompt}>
                        {log.type === "command" ? "$" : ">"}
                      </span>
                      <span className={styles.terminalCommand}>
                        {log.source}:
                      </span>
                      <span
                        className={`${styles.terminalOutput} ${styles.typing}`}
                        style={{
                          "--typing-duration": dur,
                          "--char-count": log.message.length,
                          animationDelay: delay,
                        }}
                      >
                        {log.message}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  </div>
);
