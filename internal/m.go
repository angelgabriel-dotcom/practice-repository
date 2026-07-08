package main

import (
	"fmt"
	"regexp"
	"strings"
)

func manec(str string) string {
	puncs := "?><,./';:!"
	vowels := "aeiouh"

	reg1 := regexp.MustCompile(`\s*'\s*`)
	str = reg1.ReplaceAllString(str, "'")

	words := strings.Fields(str)
	onlyPunc := regexp.MustCompile(`^[,./<>?;':!]+$`)

	for i := 0; i < len(words); i++ {
		nextword := ""

		for j := i + 1; j < len(words); j++ {
			if !onlyPunc.MatchString(words[j]) {
				nextword = words[j]
				break
			}

		}
			cleanCurrent := strings.TrimLeft(words[i], puncs)
			cleanNext := strings.TrimRight(nextword, puncs)

			if cleanCurrent == "" {
				continue
			}

			if strings.ToLower(cleanCurrent) == "a" && i+1 < len(words) && strings.ContainsAny(string(cleanNext[0]), vowels) {
				words[i] = strings.Replace(words[i], "a", "an", 1)
				words[i] = strings.Replace(words[i], "A", "An", 1)
			}
			if strings.ToLower(cleanCurrent) == "an" && i+1 < len(words) && !strings.ContainsAny(string(cleanNext[0]), vowels) {
				words[i] = strings.Replace(words[i], "an", "a", 1)
				words[i] = strings.Replace(words[i], "An", "A", 1)
			}

		}
			return strings.Join(words, " ")
	}


func main() {
	fmt.Println(manec(" ' a apple is better than a orange an man is better than an woman '"))
}
