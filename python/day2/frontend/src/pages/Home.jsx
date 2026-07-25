import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [searchArtist, setSearchArtist] = useState(null)
  const [artists, setArtists] = useState([])
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8000/artists")
      .then(res => res.json())
      .then(data => setArtists(data))
  }, [])

  const handleArtistSearch = async (e) => {
  if (e.key === "Enter" && search.trim()) {
    
    const found = artists.find(a => a.name.toLowerCase() === search.toLowerCase())
    if (found) {
      navigate("/player", { state: { artist: found } })
    } else {
    
      const res = await fetch(`http://localhost:8000/artist-search?name=${search}`)
      const data = await res.json()
      if (data.name) {
        navigate("/player", { state: { artist: { name: data.name, image: data.image, creationDate: "", members: [], bio: data.bio } } })
      }
    }
  }
}
  const filtered = artists.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2>🎵 SoundWave</h2>
        </div>
        <div>
          <h2>Your Library</h2>
          <p>Create your first playlist</p>
          <p style={{ marginTop: "16px" }}>Browse artists and find music you love</p>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <input
            className="search-bar"
            placeholder="What do you want to play?"
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleArtistSearch}
          />
        </div>

        {/* Artists Section */}
        <div className="section">
          <h2>Popular Artists</h2>
          <div className="cards-row">
            {filtered.map(artist => (
              <div key={artist.id} className="artist-card"
                onClick={() => navigate("/player", { state: { artist } })}
                style={{ position: "relative" }}
                onMouseEnter={e => e.currentTarget.querySelector('.play-btn').style.opacity = 1}
                onMouseLeave={e => e.currentTarget.querySelector('.play-btn').style.opacity = 0}
              >
                <img src={artist.image} alt={artist.name} />
                <div className="play-btn" style={{
                  position: "absolute",
                  bottom: "70px",
                  right: "16px",
                  width: "48px",
                  height: "48px",
                  background: "#1db954",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  fontSize: "20px"
                }}>▶</div>
                <h3>{artist.name}</h3>
                <p>Artist</p>
              </div>
            ))}
          </div>
        </div>

        {/* Albums Section */}
        <div className="section">
          <h2>Featured Albums</h2>
          <div className="cards-row">
            {filtered.map(artist => (
              <div key={artist.id} className="song-card"
                onClick={() => navigate("/player", { state: { artist } })}>
                <img src={artist.image} alt={artist.name} />
                <h3>{artist.name}</h3>
                <p>Since {artist.creationDate}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}