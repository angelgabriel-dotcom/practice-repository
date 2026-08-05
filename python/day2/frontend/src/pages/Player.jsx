import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect} from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useMusic } from "../music_context"

export default function Player() {
  const { state } = useLocation()
  const artist = state?.artist
  const navigate = useNavigate()
  const { setCurrentArtist, setAudioUrl } = useMusic()
  const [song, setSong] = useState("")
  const [songs, setSongs] = useState([])
  const [lyrics, setLyrics] = useState("")
  const [showLyrics, setShowLyrics] = useState(false)
  const [currentSongName, setCurrentSongName] = useState("")


  useEffect(() => {
  fetch(`http://localhost:8000/songs?artist=${artist?.name}`)
    .then(res => res.json())
    .then(data => setSongs(data.songs))
}, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [15, -15])
  const rotateY = useTransform(x, [-100, 100], [-15, 15])
  

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

const handlePlay = async (songName) => {
  if (songName === currentSongName) return  // ← stop if same song
  setCurrentSongName(songName)
  setCurrentArtist(artist)
  setAudioUrl(`http://localhost:8000/stream?song=${artist.name} ${songName}`)
  const cleanTitle = songName.replace(`${artist.name} - `, "").replace(/\(.*\)/g, "").trim()
  const res = await fetch(`http://localhost:8000/lyrics?artist=${artist.name}&title=${cleanTitle}`)
  const data = await res.json()
  setLyrics(data.lyrics)
  setShowLyrics(true)
}

    {showLyrics && lyrics && (
      <div style={{ padding: "24px 40px", marginTop: "20px" }}>
      <h2 style={{ color: "#fff", marginBottom: "16px" }}>Lyrics</h2>
      <p style={{color: "red"}}>{showLyrics ? "SHOW" : "HIDE"} - {lyrics ? "HAS LYRICS" : "NO LYRICS"}</p>
     <pre style={{ 
      color: "#b3b3b3", 
      fontSize: "15px", 
      lineHeight: "1.8",
      whiteSpace: "pre-wrap",
      fontFamily: "inherit"
    }}><p style={{color: "red"}}>{lyrics}</p></pre>
     </div>
    )}
  
  return (
    <div style={{ background: "#121212", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      <div style={{
        background: "linear-gradient(180deg, #4a1a6e 0%, #121212 100%)",
        padding: "40px",
        display: "flex",
        gap: "32px",
        alignItems: "flex-end",
        position: "relative"
      }}>
        <button onClick={() => navigate("/home")} style={{
          position: "absolute", top: "0px", left: "30px",
          background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
          fontSize: "18px", cursor: "pointer", width: "auto", padding: "8px 16px",
          borderRadius: "24px", backdropFilter: "blur(10px)", display: "flex", alignItems: "center",
          gap: "8px"
        }}>←</button>

        <motion.div
          onMouseMove={handleMouse}
          onMouseLeave={() => { x.set(0); y.set(0) }}
          style={{ rotateX, rotateY, perspective: 1000, flexShrink: 0 }}
        >
          <img
            src={artist?.image}
            alt={artist?.name}
            style={{ width: "220px", height: "220px", borderRadius: "8px", objectFit: "cover", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
          />
        </motion.div>

        <div>
          <p style={{ color: "#fff", fontSize: "13px", marginBottom: "8px" }}>Artist</p>
          <h1 style={{ color: "#fff", fontSize: "72px", fontWeight: "900", lineHeight: 1, marginBottom: "16px" }}>{artist?.name}</h1>
          <p style={{ color: "#ffffffb3", fontSize: "14px" }}> {artist?.creationDate}</p>
          {artist?.members && artist.members.length > 0 && (
         <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
         {artist.members.map((member, i) => (
      <span key={i} style={{
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "13px"
         }}>{member}</span>
          ))}
         </div>
        )}
        </div>
      </div>

      <div style={{ padding: "24px 40px", display: "flex", alignItems: "center", gap: "16px" }}>
        <input
          placeholder="Search a song..."
          onChange={e => setSong(e.target.value)}
          style={{ padding: "10px 16px", background: "#2a2a2a", border: "none", borderRadius: "20px", color: "#fff", fontSize: "14px", outline: "none", width: "250px" }}
        />
        <button onClick={() => handlePlay(song)} style={{
          background: "#1db954", border: "none", fontSize: "16px",
          cursor: "pointer", padding: "12px 24px", borderRadius: "24px",
          fontWeight: "bold", width: "auto"
        }}>▶ Play</button>
      </div>

      <div style={{ padding: "0 40px" }}>
        <div style={{ display: "flex", padding: "8px 16px", borderBottom: "1px solid #ffffff1a", marginBottom: "8px" }}>
          <span style={{ color: "#b3b3b3", width: "40px" }}>#</span>
          <span style={{ color: "#b3b3b3", fontSize: "13px" }}>Title</span>
        </div>
      {songs.map((s, i) => (
      <div key={i} onClick={() => handlePlay(s.title)}
      style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderRadius: "4px", cursor: "pointer", gap: "16px" }}
        onMouseEnter={e => e.currentTarget.style.background = "#ffffff1a"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
       >
       <span style={{ color: "#b3b3b3", width: "24px", fontSize: "14px" }}>{i + 1}</span>
        <div>
      <p style={{ color: "#fff", fontSize: "15px", fontWeight: "500" }}>{s.title}</p>
      <p style={{ color: "#b3b3b3", fontSize: "13px" }}>{artist?.name}</p>
    </div>
  </div>
))}
      </div>

    </div>
  )
}