import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import MainPage from './Pages/MainPage';
import { StockProvider } from './components/StockContext';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <StockProvider>
    
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <MainPage setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
    </StockProvider>
  );
};

export default App;
