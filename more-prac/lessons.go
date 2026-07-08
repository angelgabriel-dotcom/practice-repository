package main

import (
	"fmt"
	"strings"
)

// func main(){
// 	fibonacciSequence()
// 	printDigits()
// 	fmt.Println(reverseStr("hello word of butterflies"))
// 	fmt.Println(palindrome("racecar"))
// 	fmt.Println(swapping("wicked am i"))
// }

func printDigits() {
	for i := 1; i <= 100; i++ {
		if i%3 == 0 && i%5 == 0 {
			fmt.Println("fizzbuzz")
			continue
		}
		if i%3 == 0 {
			fmt.Println("fizz")
			continue
		}
		if i%5 == 0 {
			fmt.Println("buzz")
			continue
		}
		fmt.Println(i)

	}

}
func fibonacciSequence() {
	a := 0
	b := 1
	temp := 0

	for i := 1; i <= 10; i++ {
		fmt.Println(a)
		temp = a + b
		a = b
		b = temp
	}
}

func reverseStr(str string) string {
	char := []rune(str)
	result := ""
	for i := len(char) - 1; i >= 0; i-- {
		result += string(char[i])
	}
	return result
}

func palindrome(str string) bool {
	char := []rune(str)
	original := str
	for i, j := 0, len(char)-1; i < j; i, j = i+1, j-1 {
		char[i], char[j] = char[j], char[i]
	}
	if original == string(char) {
		return true
	}
	return false
}

func swapping(str string) string {
	words := strings.Fields(str)
	for i, j := 0, len(words)-1; i < j; i, j = i+1, j-1 {
		words[i], words[j] = words[j], words[i]
	}
	return strings.Join(words, " ")
}
