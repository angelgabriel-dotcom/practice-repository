package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Print("\n")
		return
	}

	input := os.Args[1]
	data := mirrorCount(input)
	if data == "" {
		fmt.Println("Error: empty strings")
		return
	}
	fmt.Println(data)
}
