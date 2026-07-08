package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) == 1 {
		fmt.Println("Error: Provide a Word")
		return
	}

	if len(os.Args) != 2 {
		fmt.Printf("Incorrect usage: go run . %s\nCorret usage: go run . <text>\n", os.Args[1])
		return
	}
	str := os.Args[1]
	data, err := os.ReadFile(str)
	if err != nil {
		fmt.Println("Error Reading File", err)
		return
	}
	mapp := make(map[string]int)
	for _, ch := range data {
		char := string(ch)
		mapp[char]++
	}
	fmt.Println(mapp)
}
