package main

import (
	"fmt"
	"regexp"
	"strings"
)

func fixing(str string) string {
	// 1. Fix spacing inside quotes FIRST
	// This brings the quotes flush against the words
	reDouble := regexp.MustCompile(`"\s*(.*?)\s*"`)
	str = reDouble.ReplaceAllString(str, `"$1"`)

	reSingle := regexp.MustCompile(`'\s*(.*?)\s*'`)
	str = reSingle.ReplaceAllString(str, `'$1'`)

	// 2. Fix the A/An grammar
	words := strings.Fields(str)
	for i := 0; i < len(words)-1; i++ {
		// Identify the "article" part by removing any attached quotes
		// e.g., if words[i] is `"an`, cleanWord becomes `an`
		cleanWord := strings.Trim(strings.ToLower(words[i]), `"'`)

		if cleanWord == "a" || cleanWord == "an" {
			// Find the first letter of the next word, skipping quotes
			nextWordClean := strings.Trim(strings.ToLower(words[i+1]), `"'`)

			if len(nextWordClean) > 0 {
				isVowel := strings.ContainsAny(string(nextWordClean[0]), "aeiou")

				// Determine the target article
				target := "a"
				if isVowel {
					target = "an"
				}

				// Replace the "a/an" inside the original word token
				// to keep attached quotes (e.g., `"an` becomes `"a`)
				words[i] = strings.Replace(strings.ToLower(words[i]), cleanWord, target, 1)
			}
		}
	}

	return strings.Join(words, " ")
}

func main() {
	input := `" an ' man an woman there are so a amazing creature '"`
	fmt.Println(fixing(input))
}
