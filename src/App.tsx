/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Quran from './pages/Quran';
import SurahDetail from './pages/SurahDetail';
import Learn from './pages/Learn';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import TajweedLessons from './pages/TajweedLessons';
import Grammar from './pages/Grammar';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/quran/:id" element={<SurahDetail />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tajweed" element={<TajweedLessons />} />
            <Route path="/grammar" element={<Grammar />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
