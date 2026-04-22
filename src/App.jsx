import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import StateAnalysis from './pages/StateAnalysis';
import Prediction from './pages/Prediction';
import SafetyAssistant from './pages/SafetyAssistant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<StateAnalysis />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="chatbot" element={<SafetyAssistant />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
