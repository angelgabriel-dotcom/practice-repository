import { motion, AnimatePresence } from "framer-motion"

const SHAPE_COUNT = 10
const RADIUS = 70

function polarToCartesian(angleDeg, radius) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: radius * Math.cos(angleRad),
    y: radius * Math.sin(angleRad)
  }
}

export default function VerifyAnimation({ status }) {
  if (status === "idle") return null

  const shapes = Array.from({ length: SHAPE_COUNT }, (_, i) =>
    polarToCartesian((360 / SHAPE_COUNT) * i, RADIUS)
  )

  const isError = status === "error"
  const isSuccess = status === "success"
  const color = isError ? "#e74c3c" : "#1db954"

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <motion.div
          style={{ position: "absolute", inset: 0 }}
          animate={status === "verifying" ? { rotate: 360 } : { rotate: 0 }}
          transition={
            status === "verifying"
              ? { repeat: Infinity, duration: 2.2, ease: "linear" }
              : { duration: 0.4 }
          }
        >
          {shapes.map((pos, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: `14px solid ${color}`,
              }}
              initial={{ x: pos.x - 8, y: pos.y - 7, opacity: 0, scale: 0 }}
              animate={
                isSuccess || isError
                  ? { x: -8, y: -7, opacity: 0, scale: 0.2 }
                  : { x: pos.x - 8, y: pos.y - 7, opacity: 1, scale: 1 }
              }
              transition={{
                duration: 0.5,
                delay: status === "verifying" ? i * 0.04 : 0,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        <AnimatePresence>
          {isSuccess && (
            <motion.svg
              key="check"
              width="60" height="60" viewBox="0 0 60 60"
              style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <motion.path
                d="M14 32 L25 43 L46 18"
                fill="none"
                stroke="#1db954"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
              />
            </motion.svg>
          )}

          {isError && (
            <motion.svg
              key="x"
              width="60" height="60" viewBox="0 0 60 60"
              style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, x: [0, -6, 6, -6, 0] }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <motion.path
                d="M18 18 L42 42 M42 18 L18 42"
                fill="none"
                stroke="#e74c3c"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}