import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CoursesPage from './pages/CoursesPage';
import CourseLessonsPage from './pages/CourseLessonsPage';
import LessonPage from './pages/LessonPage';
import ProgressPage from './pages/ProgressPage';
import RabbiPage from './pages/RabbiPage';
import SettingsPage from './pages/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CourseLessonsPage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/rabbi" element={<RabbiPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;