import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import BuyTokensPage from "./components/BuyTokens/BuyTokensPage";
import PlayGamePage from "./components/PlayGame/PlayGame";
import AdminPanel from "./components/Admin/AdminPanel";
import "./styles/globals.css";

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/buy-tokens" element={<BuyTokensPage />} />
              <Route path="/play-game" element={<PlayGamePage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
