import { useState, useEffect, useRef } from "react"
import { useMusic } from "../music_context"

export default function BottomPlayer() {
  const { currentArtist, audioUrl } = useMusic()
  const [isLoading, setIsLoading] = useState(true)
  const [showLyrics, setShowLyrics] = useState(false)
  const [lyrics, setLyrics] = useState("")
  const [syncedLyrics, setSyncedLyrics] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    setIsLoading(true)
  }, [audioUrl])

  useEffect(() => {
    if (audioUrl && currentArtist) {
      const songName = audioUrl.split("song=")[1]?.replace(/%20/g, " ") || ""
      const cleanTitle = songName
        .replace(currentArtist.name, "")
        .replace(/\(Official.*?\)/gi, "")
        .replace(/\[Official.*?\]/gi, "")
        .replace(/Official.*?Video/gi, "")
        .replace(/Official.*?Audio/gi, "")
        .replace(/ft\..*$/gi, "")
        .replace(/-/g, "")
        .trim()

      fetch(`http://localhost:8000/lyrics?artist=${currentArtist.name}&title=${cleanTitle}`)
        .then(res => res.json())
        .then(data => {
          setLyrics(data.lyrics || "")
          if (data.synced) {
            const lines = data.synced.split("\n").map(line => {
              const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/)
              if (match) {
                const minutes = parseInt(match[1])
                const seconds = parseFloat(match[2])
                return { time: minutes * 60 + seconds, text: match[3].trim() }
              }
              return null
            }).filter(Boolean)
            setSyncedLyrics(lines)
          } else {
            setSyncedLyrics([])
          }
        })
        .catch(() => {
          setLyrics("Lyrics not available")
          setSyncedLyrics([])
        })
    }
  }, [audioUrl])

  const activeLine = syncedLyrics.reduce((acc, line, i) => {
    if (line.time <= currentTime) return i
    return acc
  }, 0)

  if (!audioUrl) return null

  return (
    <>
      {showLyrics && (
        <div style={{
          position: "fixed",
          bottom: "90px",
          right: "0",
          width: "350px",
          height: "400px",
          background: "rgba(24, 24, 24, 0.85)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          padding: "20px",
          overflowY: "auto",
          zIndex: 99,
          animation: "slideIn 0.3s ease-out",
          borderRadius: "16px 0 0 0"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "#fff" }}>🎤 Lyrics</h3>
            <button onClick={() => setShowLyrics(false)} style={{
              background: "transparent",
              border: "none",
              color: "#b3b3b3",
              fontSize: "20px",
              cursor: "pointer",
              width: "auto",
              padding: "4px 8px"
            }}>✕</button>
          </div>

          {syncedLyrics.length > 0 ? syncedLyrics.map((line, i) => (
            <p key={i} style={{
              color: i === activeLine ? "#1db954" : "#b3b3b3",
              fontSize: i === activeLine ? "16px" : "14px",
              fontWeight: i === activeLine ? "bold" : "normal",
              lineHeight: "1.8",
              transition: "all 0.3s ease"
            }}>{line.text}</p>
          )) : <pre style={{ color: "#b3b3b3", fontSize: "14px", lineHeight: "1.8", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{lyrics}</pre>}
        </div>
      )}

      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        height: "90px",
        background: "#181818",
        borderTop: "1px solid #282828",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: "16px",
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "200px" }}>
          {currentArtist && (
            <>
              <img src={currentArtist.image} alt={currentArtist.name}
                style={{ width: "56px", height: "56px", borderRadius: "4px", objectFit: "cover" }} />
              <div>
                <p style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>{currentArtist.name}</p>
                <p style={{ color: isLoading ? "#1db954" : "#b3b3b3", fontSize: "12px" }}>
                  {isLoading ? "⏳ Loading..." : "Now Playing"}
                </p>
              </div>
            </>
          )}
        </div>

        <audio
          ref={audioRef}
          controls
          autoPlay
          src={audioUrl}
          onCanPlay={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          style={{ flex: 1, height: "40px" }}
        />

        <button onClick={() => setShowLyrics(!showLyrics)} style={{
          background: showLyrics ? "#1db954" : "transparent",
          border: "1px solid #535353",
          color: "#fff",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: "pointer",
          fontSize: "16px",
          width: "auto"
        }}>🎤</button>
      </div>
    </>
  )
}