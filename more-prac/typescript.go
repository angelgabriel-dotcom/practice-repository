package main

import (
	"fmt"
	"os"
	"time"
)

func typescript(str string) {
	for _, char := range str {
		fmt.Printf("%c", char)
		os.Stdout.Sync()
		time.Sleep(50 * time.Millisecond)
	}
	fmt.Println()

}
