package main

import (
	"fmt"
	"os"
	"strings"
)

func Process(data []byte) string {
	return strings.ToUpper(string(data))
}

func main() {
	if len(os.Args) != 3 {
		fmt.Println("Usage: go run . sample.txt result.txt")
		return
	}
	input := os.Args[1]
	output := os.Args[2]

	// READING FILE
	// ARGS

	data, err := os.ReadFile(input)
	// if there Is An Error
	if err != nil {
		fmt.Println("Error: Reading File", err)
		return
	}
	result := string(data)
	result = calling(result)

	// Writing Our Data Back To our output File
	err = os.WriteFile(output, []byte(result), 0644)
	if err != nil {
		fmt.Println("Error: Reading File", err)
		return
	}
	fmt.Println("Am So Angry But Go And Check, Your Result Is Ready")

}
