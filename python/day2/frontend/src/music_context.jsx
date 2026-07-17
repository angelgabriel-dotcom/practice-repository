import { createContext, useContext, useState } from "react"

const MusicContext = createContext()

export function MusicProvider({ children }) {
  const [currentArtist, setCurrentArtist] = useState(null)
  const [audioUrl, setAudioUrl] = useState("")

  return (
    <MusicContext.Provider value={{ currentArtist, setCurrentArtist, audioUrl, setAudioUrl }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  return useContext(MusicContext)
}