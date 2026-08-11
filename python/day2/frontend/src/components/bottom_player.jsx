import { useState, useEffect, useRef } from "react"
import { useMusic } from "../music_context"
import { extractArtistAndTitle } from "../utils"
import FullScreenLyrics from "./fullscreenlyrics"

export default function BottomPlayer() {
  const { currentArtist, audioUrl, currentSongTitle } = useMusic()
  const [isLoading, setIsLoading] = useState(true)
  const [syncedLyrics, setSyncedLyrics] = useState([])
  const [lyrics, setLyrics] = useState("")
  const [showLyrics, setShowLyrics] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)
  const [hasEnded, setHasEnded] = useState(false)
  const [fullScreenOpen, setFullScreenOpen] = useState(false)
  

  useEffect(() => {
  setIsLoading(true)
  setHasEnded(false)
}, [audioUrl])

useEffect(() => {
  if (audioUrl && currentArtist && currentSongTitle) {
    let cancelled = false
    const { artist: realArtist, title: cleanTitle } = extractArtistAndTitle(currentSongTitle, currentArtist.name)

    console.log("Fetching lyrics for:", realArtist, cleanTitle)
    fetch(`http://localhost:8000/lyrics?artist=${realArtist}&title=${cleanTitle}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return
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
        if (cancelled) return
        setLyrics("Lyrics not available")
        setSyncedLyrics([])
      })

    return () => {
      cancelled = true
    }
  }
}, [audioUrl])

useEffect(() => {
  let rafId

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
    rafId = requestAnimationFrame(updateTime)
  }

  rafId = requestAnimationFrame(updateTime)

  return () => cancelAnimationFrame(rafId)
}, [])

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
          )) : (
            <>
              {lyrics && (
                <p style={{ color: "#727272", fontSize: "12px", marginBottom: "12px", fontStyle: "italic" }}>
                  Synced lyrics not available for this track
                </p>
              )}
              <pre style={{ color: "#b3b3b3", fontSize: "14px", lineHeight: "1.8", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                {lyrics}
              </pre>
            </>
          )}
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
                <p style={{ color: isLoading ? "#1db954" : hasEnded ? "#b3b3b3" : "#1db954", fontSize: "12px" }}>
                 {isLoading ? "⏳ Loading..." : hasEnded ? "Finished" : `${currentArtist.name} - ${currentSongTitle}`}
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
         onEnded={() => setHasEnded(true)}
         style={{ flex: 1, height: "40px" }}
      />

        <button onClick={() => setFullScreenOpen(true)} style={{
        background: "transparent",
        border: "1px solid #535353",
        color: "#fff",
        borderRadius: "4px",
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: "16px",
        width: "auto"
      }}>🎤</button>
      </div>
      <FullScreenLyrics
       isOpen={fullScreenOpen}
       onClose={() => setFullScreenOpen(false)}
       currentArtist={currentArtist}
       currentSongTitle={currentSongTitle}
       lyrics={lyrics}
       syncedLyrics={syncedLyrics}
       activeLine={activeLine}
      />
    </>
  )
}