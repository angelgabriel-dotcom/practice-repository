package main

// Write a function named AlphaPosition that takes an alphabetical character as a parameter and returns the position of the letter in the alphabet.

// If the character is not in the alphabet, return -1
// If the character is in the alphabet, return the position of the letter in the alphabet

func AlphaPosition(c rune) int {
	if c >= 97 && c <= 122 {
		position := (c - 'a') + 1
		return int(position)

	} else if c >= 65 && c <= 90 {
		position := (c - 'A') + 1
		return int(position)
	} else {
		return -1
	}
}
