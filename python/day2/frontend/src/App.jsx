import { useState } from "react"

export default function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [song, setSong] = useState("")
  const [searchResult, setSearchResult] = useState("")

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.message === "Login successful") {
      setLoggedIn(true)
    } else {
      setMessage(data.message)
    }
  }

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:8000/search?song=${song}`)
    const data = await res.json()
    setSearchResult(data.message)
  }

  if (loggedIn) {
    return (
      <div className="container">
        <h1>🎵 Music Player</h1>
        <input placeholder="Search for a song..." onChange={e => setSong(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        <p>{searchResult}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Music Player</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  )
}