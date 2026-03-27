import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Simulator } from './pages/Simulator';
import { History } from './pages/History';
import { Guides } from './pages/Guides';
import { Profile } from './pages/Profile';
import { AppProvider } from './state/AppContext';

function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Simulator />} />
          <Route path="/history" element={<History />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

export default App;
