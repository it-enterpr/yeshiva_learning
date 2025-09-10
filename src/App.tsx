import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthModal from './components/AuthModal';
import CoursesPage from './pages/CoursesPage';
import CourseLessonsPage from './pages/CourseLessonsPage';
import LessonPage from './pages/LessonPage';
import ProgressPage from './pages/ProgressPage';
import RabbiPage from './pages/RabbiPage';
import SettingsPage from './pages/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { loading, login, showAuthModal, setShowAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-white text-lg font-semibold">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <>
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
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={login}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;