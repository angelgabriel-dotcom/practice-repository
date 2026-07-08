package main

import (
	"fmt"
	"regexp"
	"strings"
)

func learn(str string) string {
	vowels := "aeiouh"
	puncs := ">,:;',<?!?"

	str = strings.ReplaceAll(str, " '", "'")
	str = strings.ReplaceAll(str, "' ", "'")

	words := strings.Fields(str)
	puncOnly := regexp.MustCompile(`^[.,!?;:"'><:;?]+$`)

	for i := 0; i < len(words); i++ {
		nextword := ""
		for j := i + 1; j < len(words); j++ {
			if !puncOnly.MatchString(words[j]) {
				nextword = words[j]
				break
			}
		}

		cleanCurrent := strings.TrimLeft(words[i], puncs)
		cleanNext := strings.TrimLeft(nextword, puncs)

		if cleanNext == "" {
			continue
		}

		if strings.ToLower(cleanCurrent) == "a" && strings.ContainsAny(string(cleanNext[0]), vowels) {
			words[i] = strings.Replace(words[i], "a", "an", 1)
			words[i] = strings.Replace(words[i], "A", "An", 1)
		}

		if strings.ToLower(cleanCurrent) == "an" && !strings.ContainsAny(string(cleanNext[0]), vowels) {
			words[i] = strings.Replace(words[i], "an", "a", 1)
			words[i] = strings.Replace(words[i], "An", "A", 1)
		}
	}
	return strings.Join(words, " ")
}

func main() {
	fmt.Println(learn(" ' a apple is better than a orange an man is better than an woman '"))
}
