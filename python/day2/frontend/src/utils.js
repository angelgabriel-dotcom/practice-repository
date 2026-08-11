export function extractArtistAndTitle(rawTitle, fallbackArtist) {
  let title = rawTitle
  let artist = fallbackArtist

  const dashIndex = title.indexOf(" - ")
  if (dashIndex !== -1) {
    const artistPart = title.slice(0, dashIndex)
    const firstArtist = artistPart.split(",")[0].trim()
    if (firstArtist) {
      artist = firstArtist
    }
    title = title.slice(dashIndex + 3)
  }

  title = title.replace(/\([^)]*\)/g, "")
  title = title.replace(/\[[^\]]*\]/g, "")
  title = title.replace(/\b(feat\.?|ft\.?|featuring)\s+.*/gi, "")
  title = title.replace(/\bwith\s+.*/gi, "")

  const artistRegex = new RegExp(artist.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
  title = title.replace(artistRegex, "")

  title = title
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/^[-,\s]+|[-,\s]+$/g, "")

  return { artist, title }
}