export function cleanSongTitle(rawTitle, artistName) {
  let title = rawTitle

  const dashIndex = title.indexOf(" - ")
  if (dashIndex !== -1) {
    title = title.slice(dashIndex + 3)
  }

  title = title.replace(/\([^)]*\)/g, "")
  title = title.replace(/\[[^\]]*\]/g, "")
  title = title.replace(/\b(feat\.?|ft\.?|featuring)\s+.*/gi, "")
  title = title.replace(/\bwith\s+.*/gi, "")

  if (artistName) {
    const artistRegex = new RegExp(artistName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")
    title = title.replace(artistRegex, "")
  }

  return title
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/^[-,\s]+|[-,\s]+$/g, "")
}