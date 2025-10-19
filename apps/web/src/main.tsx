
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ToastProvider } from "./components/Toast";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);
  
