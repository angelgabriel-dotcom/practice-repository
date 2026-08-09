import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Player from "./pages/Player"
import BottomPlayer from "./components/bottom_player"
import { useAuth } from "./auth_context"

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/player" element={<RequireAuth><Player /></RequireAuth>} />
      </Routes>
      <BottomPlayer />
    </BrowserRouter>
  )
}