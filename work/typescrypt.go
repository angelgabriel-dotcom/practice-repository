package main

import (
	"fmt"
	"os"
	"time"
)

func typescript(str string) {

	for _, ch := range str {
		fmt.Printf("%c", ch)
		os.Stdout.Sync()
		time.Sleep(40 * time.Millisecond)

	}
	fmt.Println()
}
