import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import CountryDetails from "./Pages/CountryDetails";
import NotFound from "./Pages/NotFound";

import "./App.css";

function App() {
  return (
    <>
      <Router basename="/">
        <div className="App">
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/:country" element={<CountryDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
