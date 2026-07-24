import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.message === "Login successful") {
      navigate("/home")
    } else {
      setMessage(data.message)
    }
  }

  return (
    <div className="container">
      <h1>🎵 Music Player</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
      <p style={{ marginTop: "16px" }}>Don't have an account? <span onClick={() => navigate("/register")} style={{ color: "#1db954", cursor: "pointer" }}>Register</span></p>
    </div>
  )
}