import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as ColorThiefModule from "colorthief"

const ColorThief = ColorThiefModule.default || ColorThiefModule

export default function FullScreenLyrics({
  isOpen,
  onClose,
  currentArtist,
  currentSongTitle,
  lyrics,
  syncedLyrics,
  activeLine
}) {
  const [accentColor, setAccentColor] = useState("29, 185, 84")
  const [userScrolling, setUserScrolling] = useState(false)
  const imgRef = useRef(null)
  const activeLineRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const scrollTimeoutRef = useRef(null)

  const handleUserScroll = () => {
    setUserScrolling(true)

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false)
    }, 3000)
  }

  useEffect(() => {
    if (!currentArtist?.image) return

    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = currentArtist.image

    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const [r, g, b] = colorThief.getColor(img)
        setAccentColor(`${r}, ${g}, ${b}`)
      } catch (e) {
        setAccentColor("29, 185, 84")
      }
    }
  }, [currentArtist?.image])

  useEffect(() => {
    if (!userScrolling && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [activeLine, userScrolling])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            overflow: "hidden",
            background: "#0a0a0a"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${currentArtist?.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(60px) brightness(0.35)",
              transform: "scale(1.2)"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 50% 30%, rgba(${accentColor}, 0.25), rgba(10,10,10,0.9) 70%)`
            }}
          />

          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              fontSize: "18px",
              cursor: "pointer",
              zIndex: 10,
              backdropFilter: "blur(10px)"
            }}
          >
            ✕
          </button>

          <div
            style={{
              position: "relative",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              padding: "60px 20px 40px"
            }}
          >
            <motion.img
              src={currentArtist?.image}
              alt={currentArtist?.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "12px",
                objectFit: "cover",
                boxShadow: `0 10px 40px rgba(${accentColor}, 0.4)`,
                marginBottom: "12px"
              }}
            />
            <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "600", marginBottom: "2px" }}>
              {currentSongTitle}
            </h2>
            <p style={{ color: "#b3b3b3", fontSize: "14px", marginBottom: "32px" }}>
              {currentArtist?.name}
            </p>

            <div
              ref={scrollContainerRef}
              onScroll={handleUserScroll}
              style={{
                flex: 1,
                width: "100%",
                maxWidth: "600px",
                overflowY: "auto",
                textAlign: "center",
                scrollbarWidth: "none",
                maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
              }}
            >
              {syncedLyrics.length > 0 ? (
                syncedLyrics.map((line, i) => {
                  const isActive = i === activeLine
                  const distance = Math.abs(i - activeLine)
                  return (
                    <motion.p
                      key={i}
                      ref={isActive ? activeLineRef : null}
                      animate={{
                        opacity: isActive ? 1 : Math.max(0.25, 1 - distance * 0.2),
                        scale: isActive ? 1.08 : 1,
                        color: isActive ? `rgb(${accentColor})` : "#b3b3b3"
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      style={{
                        fontSize: isActive ? "26px" : "19px",
                        fontWeight: isActive ? "700" : "500",
                        lineHeight: "1.6",
                        marginBottom: "18px",
                        textShadow: isActive ? `0 0 24px rgba(${accentColor}, 0.6)` : "none",
                        transition: "font-size 0.3s ease"
                      }}
                    >
                      {line.text}
                    </motion.p>
                  )
                })
              ) : (
                <pre style={{
                  color: "#d0d0d0",
                  fontSize: "18px",
                  lineHeight: "2",
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit"
                }}>
                  {lyrics || "Lyrics not available"}
                </pre>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}