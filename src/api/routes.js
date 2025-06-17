import axios from "axios";

// 🎯 SINGLE POINT OF CONFIGURATION - Change this to switch between local/remote
// const route = "https://cdbackend.onrender.com";
const route = "http://localhost:8000";

const localRoute = "http://localhost:5053";

// 🚀 Auto-detect WebSocket URL based on the route
export const getWebSocketBaseUrl = () => {
  if (route.includes("localhost")) {
    return "ws://localhost:8000/ws";
  } else {
    return "wss://cdbackend.onrender.com/ws";
  }
};

// Live streams only
export const getStreamsLive = async () => {
  try {
    const res = await axios.get(`${route}/live`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Demo streams only
export const getStreamsDemo = async () => {
  try {
    const res = await axios.get(`${route}/demo`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getLatestFrame = async (streamId) => {
  try {
    const res = await axios.get(`${route}/stream/${streamId}/frame`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const call = async (prompt, to) => {
  to = "+15716996433";
  console.log("Run");
  try {
    const res = await axios.post(`${localRoute}/trigger-call`, {
      prompt,
      to,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
