package main

import (
	"strings"
)

// Write a program called alphamirror that takes a string as argument and displays this string after replacing each alphabetical character with the opposite alphabetical character.

// The case of the letter remains unchanged, for example :

// 'a' becomes 'z', 'Z' becomes 'A' 'd' becomes 'w', 'M' becomes 'N'

// The final result will be followed by a newline ('\n').

// If the number of arguments is different from 1, the program prints a new line.
func mirrorCount(str string) string {

	var res strings.Builder
	for _, ch := range str {
		if ch >= 97 && ch <= 122 {
			mirror := 219 - ch
			res.WriteRune(mirror)
		} else if ch >= 65 && ch <= 90 {
			mirror := 155 - ch
			res.WriteRune(mirror)
		} else {
			res.WriteRune(ch)
		}

	}
	return res.String()
}
