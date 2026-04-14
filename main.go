package main

import (
	"fmt"
	"strings"
)

func fixArticles(str []string) []string {
	// str := strings.Fields(str)
	for i := 0; i < len(str); i++ {
		if strings.ToLower(str[i]) == "a" {
			currentword := strings.ToLower(string(str[i+1][0]))
			if strings.ContainsAny(currentword, "aeiouh") {
				if str[i] == "A" {
					str[i] = "An"
				} else {
					if str[i] == "a" {
						str[i] = "an"
					}
				}
			}
		}
	}
	return str
}

func main() {
	main := []string{"a", "man", "a", "amazing", "a", "honest"}
	result := fixArticles(main)
	fmt.Println(result)
}
