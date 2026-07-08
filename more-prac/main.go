package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) != 2 && len(os.Args) != 3 && len(os.Args) != 4 {
		fmt.Println("Error usage: go run . <text> ")
		return
	}

	input := os.Args[1]
	res := AlphaCount(input)
	if res == 0 {
		fmt.Print("string is empty you need to input something\n")

	}
	if len(os.Args) == 3 {
		input = os.Args[2]
	}
	vow := countVowels(input)
	if vow == 0 {
		fmt.Printf("your current string is %d\n", vow)

		if len(os.Args) == 4 {
			input = os.Args[3]
		}
	}
	fmt.Println(res, vow)
}
