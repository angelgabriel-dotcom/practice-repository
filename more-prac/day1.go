package main

import (
	"strings"
)

func countVowels(str string) int {
	count := 0
	vowels := "aeiouAEIOU"
	for _, t := range str {
		if strings.ContainsAny(string(t), vowels) {
			count++
		}
	}
	return count
}

// func main() {
// 	fmt.Println(countVowels("hello"))
// }
