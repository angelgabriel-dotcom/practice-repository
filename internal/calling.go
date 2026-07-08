package main

import (
	"strings"
)

func calling(str string) string {
	words := strings.Split(str, "\n")
	var res []string
	for _, ch := range words {
		ch = fixing(ch)
		res = append(res, ch)
	}
	return strings.Join(res, "\n")
}
