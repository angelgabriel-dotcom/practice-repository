import { createContext, useContext, useState } from "react"

const MusicContext = createContext()

export function MusicProvider({ children }) {
  const [currentArtist, setCurrentArtist] = useState(null)
  const [audioUrl, setAudioUrl] = useState("")
  const [currentSongTitle, setCurrentSongTitle] = useState("")

  return (
    <MusicContext.Provider value={{
      currentArtist, setCurrentArtist,
      audioUrl, setAudioUrl,
      currentSongTitle, setCurrentSongTitle
    }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  return useContext(MusicContext)
}