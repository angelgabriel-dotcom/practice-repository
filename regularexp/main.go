package main

import (
	"fmt"
	"regexp"
	"strings"
)

func manec(str string) string {
	punc := "?><,./';:!"
	vowels := "aeiouh"
	reg := regexp.MustCompile(`\s*'\s*`)
	str = reg.ReplaceAllString(str, "'")
	words := strings.Fields(str)
	onlypunc := regexp.MustCompile(`^[,./?><';:!]+$`)
	for i := 0; i < len(words); i++ {
		nextword := ""
		for j := i + 1; j < len(words); j++ {
			if !onlypunc.MatchString(words[j]) {
				nextword = words[j]
				break
			}
		}
		cleanCurrent := strings.TrimLeft(words[i], punc)
		cleanNext := strings.TrimRight(nextword, punc)

		if cleanCurrent == "" {
			continue
		}
		if strings.ToLower(cleanCurrent) == "a" && i+1 < len(words) && strings.ContainsAny(string(cleanNext[0]), vowels) {
			if words[i] == "a" {
				words[i] = "an"
			}
			if words[i] == "A" {
				words[i] = "An"
			}

		}
		if strings.ToLower(cleanCurrent) == "an" && i+1 < len(words) && !strings.ContainsAny(string(cleanNext[0]), vowels) {
			if words[i] == "an" {
				words[i] = "a"
			}
			if words[i] == "An" {
				words[i] = "A"
			}

		}
	}
	return strings.Join(words, " ")
}

func main() {
	fmt.Println(manec(" ' a apple is better than a orange an man is better than an woman '"))
}
