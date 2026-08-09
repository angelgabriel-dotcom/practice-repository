import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import VerifyAnimation from "../components/verifyanimation"

export default function Register() {
  const [step, setStep] = useState("register")
  const [verifyCode, setVerifyCode] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const [verifyStatus, setVerifyStatus] = useState("idle") // idle | verifying | success | error


  const handleRegister = async () => {
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.message === "verification_sent") {
      setStep("verify")
    } else {
      setMessage(data.message)
    }
  }

const handleVerify = async () => {
  setVerifyStatus("verifying")

  const res = await fetch("http://localhost:8000/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code: verifyCode })
  })
  const data = await res.json()

  if (data.message === "Account created successfully") {
    setVerifyStatus("success")
    setTimeout(() => navigate("/"), 1400)
  } else {
    setVerifyStatus("error")
    setMessage(data.message)
    setTimeout(() => setVerifyStatus("idle"), 1200)
  }
}

  return (
    <AnimatePresence mode="wait">
      {step === "verify" ? (
        <motion.div
          key="verify"
          className="container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <VerifyAnimation status={verifyStatus} />
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
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleVerify}>
            Verify
          </motion.button>
          <p>{message}</p>
        </motion.div>
      ) : (
        <motion.div
          key="register"
          className="container"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.3 }}
        >
          <h1>🎵 Create Account</h1>
          <input placeholder="Email" autoComplete="off" onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" autoComplete="new-password" onChange={e => setPassword(e.target.value)} />
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleRegister}>
            Register
          </motion.button>
          <p>{message}</p>
          <p style={{ marginTop: "16px" }}>Already have an account? <span onClick={() => navigate("/")} style={{ color: "#1db954", cursor: "pointer" }}>Login</span></p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}