import { useMusic } from "../music_context"

export default function BottomPlayer() {
  const { currentArtist, audioUrl } = useMusic()

  if (!audioUrl) return null

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "90px",
      background: "#181818",
      borderTop: "1px solid #282828",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: "16px",
      zIndex: 100
    }}>
      {/* Artist info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "200px" }}>
        {currentArtist && (
          <>
            <img src={currentArtist.image} alt={currentArtist.name}
              style={{ width: "56px", height: "56px", borderRadius: "4px", objectFit: "cover" }} />
            <div>
              <p style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>{currentArtist.name}</p>
              <p style={{ color: "#b3b3b3", fontSize: "12px" }}>Artist</p>
            </div>
          </>
        )}
      </div>

      {/* Audio player */}
      <audio controls autoPlay src={audioUrl}
        style={{ flex: 1, height: "40px" }} />
    </div>
  )
}