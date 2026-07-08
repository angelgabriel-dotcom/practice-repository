package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/count", countHandler)
	fmt.Println("server live on port 8080")
	http.ListenAndServe(":8080", nil)
}
