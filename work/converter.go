package main

import (
	"fmt"
	"strconv"
	"strings"
)

func hexadecimal(str string) string {
	words := strings.Fields(str)
	for i := 0; i < len(words); i++ {
		if words[i] == "(hex)" && i > 0 {
			data, err := strconv.ParseInt(words[i-1], 16, 64)
			if err != nil {
				fmt.Println("failed to convert")
			}
			words[i-1] = strconv.FormatInt(data, 10)
			words = append(words[:i], words[i+1:]...)
			i--
		}
	}
	return strings.Join(words, " ")
}
