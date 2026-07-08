package main

import "fmt"

func AlphaCount(s string) int {
	count := 0

	for _, ch := range s {
		if (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') {
			count++
		}
		if (ch >= 32 && ch <= 47) || (ch >= 58 && ch <= 64) || (ch >= 91 && ch <= 96) || (ch >= 123 && ch <= 126) {
			fmt.Printf("Error: %c is not an alphabet\n", ch)
		}
		if (ch >= 128 && ch <= 255) {
			fmt.Printf("%c is not a recorgnize character\n", ch)
			continue
		}
	}
	return count
}
