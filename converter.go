package main

import (
	"fmt"
	"strconv"
	"strings"
)

func convertHex(str string) string {
	words := strings.Fields(str)
	for i := 0; i < len(words); i++ {
		if words[i] == "(hex)" && i > 0 {
			conv, err := strconv.ParseInt(words[i-1], 16, 64)
			if err == nil {
				words[i-1] = strconv.FormatInt(conv, 10)
				words = append(words[:i], words[i+1:]...)
				i--
			}
		}
	}
	return strings.Join(words, " ")
}

func main() {
	fmt.Println(convertHex("1E (hex) were added"))
}
