package main

import (
	"fmt"
	"regexp"
)

func sss(str string) string {
	hll := regexp.MustCompile(`([.,?;'!"])\s*([.,?;'!"])*`) // collapsed fixing/ removing
	str = hll.ReplaceAllString(str, "$1")
	holl := regexp.MustCompile(`\s*([.,?;'!:"])\s*`) // fixing space around punctuation
	str = holl.ReplaceAllString(str, "$1 ")
	hall := regexp.MustCompile(`\s*'\s*`) //fixing quotes differently
	str = hall.ReplaceAllString(str, "'")
	return str
}
func main() {
	fmt.Println(sss(" '    those :that     !    !     live    .,,  with hunger    '"))
}
