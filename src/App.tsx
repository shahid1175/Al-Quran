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
import Explore from './pages/Explore';
import Duas from './pages/Duas';
import Zakat from './pages/Zakat';
import NamesOfAllah from './pages/NamesOfAllah';
import MakkahLive from './pages/MakkahLive';
import PrayerRequests from './pages/PrayerRequests';
import Guides from './pages/Guides';
import Quotes from './pages/Quotes';
import MosqueFinder from './pages/MosqueFinder';
import HalalFood from './pages/HalalFood';
import Blog from './pages/Blog';
import GreetingCards from './pages/GreetingCards';
import HadithPage from './pages/Hadith';
import FiqhPage from './pages/Fiqh';
import IslamicBooks from './pages/IslamicBooks';

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
            <Route path="/explore" element={<Explore />} />
            <Route path="/duas" element={<Duas />} />
            <Route path="/zakat" element={<Zakat />} />
            <Route path="/names" element={<NamesOfAllah />} />
            <Route path="/live" element={<MakkahLive />} />
            <Route path="/prayers" element={<PrayerRequests />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/mosque" element={<MosqueFinder />} />
            <Route path="/halal" element={<HalalFood />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/cards" element={<GreetingCards />} />
            <Route path="/hadith" element={<HadithPage />} />
            <Route path="/fiqh" element={<FiqhPage />} />
            <Route path="/books" element={<IslamicBooks />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}
