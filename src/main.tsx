import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PoolPage from "./pages/PoolPage.tsx";
// import Dev from "./pages/dev.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/playerPools" element={<PoolPage />} />
        {/* <Route path="/dev" element={<Dev />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
