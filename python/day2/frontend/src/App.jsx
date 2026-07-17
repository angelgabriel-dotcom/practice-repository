import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Player from "./pages/Player"
import BottomPlayer from "./components/bottom_player"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/player" element={<Player />} />
      </Routes>
      <BottomPlayer />
    </BrowserRouter>
  )
}