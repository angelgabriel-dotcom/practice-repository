import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleRegister = async () => {
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    setMessage(data.message)
    if (data.message.includes("successfully")) {
      setTimeout(() => navigate("/"), 1500)
    }
  }

  return (
    <div className="container">
      <h1>🎵 Create Account</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
      <p style={{ marginTop: "16px" }}>Already have an account? <span onClick={() => navigate("/")} style={{ color: "#1db954", cursor: "pointer" }}>Login</span></p>
    </div>
  )
}