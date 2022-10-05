import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Articles from "./article";
import Friends from "./friends";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Articles />} />
        <Route path="firends" element={<Friends />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
