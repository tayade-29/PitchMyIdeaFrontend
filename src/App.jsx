import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { store } from './store/store'
import Navbar from './components/Navbar'
import IdeasPage from './pages/IdeasPage'
import ExplorePage from './pages/ExplorePage'
import PostIdeaPage from './pages/PostIdeaPage'
import IdeaDetailPage from './pages/IdeaDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import './index.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthWrapper />
      </Router>
    </Provider>
  )
}

// Wrapper component to handle authentication
function AuthWrapper() {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()
  
  // Redirect to login if not authenticated and trying to access protected routes
  if (!user && !['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Show navbar only on protected routes */}
      {user && <Navbar />}
      <main className={user ? "pt-20" : ""}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes - only accessible when logged in */}
          <Route path="/" element={<IdeasPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/idea/:id" element={<IdeaDetailPage />} />
          <Route path="/post" element={<PostIdeaPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App