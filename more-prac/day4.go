package main

import (
	"strings"
)

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
