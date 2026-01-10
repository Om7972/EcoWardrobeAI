import "./global.css";
// Initialize axios client early to set up interceptors
import "./lib/axios";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(<App />);
