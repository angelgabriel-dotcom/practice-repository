
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Register() {
const [step, setStep] = useState("register")
const [verifyCode, setVerifyCode] = useState("")
const [serverCode, setServerCode] = useState("")
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
  if (data.message === "verification_sent") {
    setServerCode(data.code)
    setStep("verify")
  } else {
    setMessage(data.message)
  }
}

const handleVerify = async () => {
  if (verifyCode === serverCode) {
    // save to file
    await fetch("http://localhost:8000/save_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    setMessage("Account created successfully! Redirecting...")
    setTimeout(() => navigate("/"), 1500)
  } else {
    setMessage("Wrong code! Try again.")
  }
}

if (step === "verify") {
  return (
    <div className="container">
      <h1>🎵 Verify Email</h1>
      <p style={{ color: "#b3b3b3", marginBottom: "16px" }}>We sent a code to {email}</p>
      <input 
        key="verify-code"
        placeholder="Enter verification code" 
        type="text"
        autoComplete="off"
        defaultValue=""
        onChange={e => setVerifyCode(e.target.value)} 
      />
      <button onClick={handleVerify}>Verify</button>
      <p>{message}</p>
    </div>
  )
}

return (
  <div className="container">
    <h1>🎵 Create Account</h1>
    <input placeholder="Email" autoComplete="off" onChange={e => setEmail(e.target.value)} />
    <input placeholder="Password" type="password" autoComplete="new-password" onChange={e => setPassword(e.target.value)} />
    <button onClick={handleRegister}>Register</button>
    <p>{message}</p>
    <p style={{ marginTop: "16px" }}>Already have an account? <span onClick={() => navigate("/")} style={{ color: "#1db954", cursor: "pointer" }}>Login</span></p>
  </div>
)
}