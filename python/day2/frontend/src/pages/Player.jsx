import { useLocation, useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useMusic } from "../music_context"


export default function Player() {
  const { state } = useLocation()
  const artist = state?.artist
  const navigate = useNavigate()
  const [song, setSong] = useState("")
const { setCurrentArtist, setAudioUrl, audioUrl } = useMusic()
  

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [15, -15])
  const rotateY = useTransform(x, [-100, 100], [-15, 15])

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }


const handleSearch = () => {
  setCurrentArtist(artist)
  setAudioUrl(`http://localhost:8000/stream?song=${artist.name} ${song}`)
}

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
      <button onClick={() => navigate("/home")} style={{ alignSelf: "flex-start", marginBottom: "20px", background: "transparent", color: "#00ff64", border: "1px solid #00ff64", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}>← Back</button>

      <motion.div onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateX, rotateY, perspective: 1000, width: "300px", height: "300px", borderRadius: "16px", overflow: "hidden", marginBottom: "30px" }}>
        <img src={artist?.image} alt={artist?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>

      <h1 style={{ color: "#fff", marginBottom: "8px" }}>{artist?.name}</h1>
      <p style={{ color: "#aaa", marginBottom: "30px" }}>Since {artist?.creationDate}</p>

     <div style={{ display: "flex", gap: "12px", marginBottom: "20px", width: "600px" }}>
       <input 
  placeholder={`Search ${artist?.name} song...`} 
  onChange={e => setSong(e.target.value)}
  style={{ 
    flex: 1, 
    padding: "12px 16px", 
    background: "#1a1a1a", 
    border: "1px solid #333", 
    borderRadius: "8px", 
    color: "#fff", 
    outline: "none",
    fontSize: "16px",
    width: "100%"
  }} 
 />
        <button onClick={handleSearch} style={{ padding: "12px 20px", background: "#00ff64", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Play</button>
      </div>
    </div>
  )
}