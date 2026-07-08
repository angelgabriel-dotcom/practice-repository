package main

import (
	"fmt"
	"io"
	"net/http"
)

func countHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		fmt.Fprint(w, "Send a POST request with text to count words")
	}

	if r.Method == "POST" {
		data, err := io.ReadAll(r.Body)
		defer r.Body.Close()
		if err != nil {
			http.Error(w, "Error: page not found", http.StatusMethodNotAllowed)
			return
		}

		fmt.Fprintln(w, len(data))
	}
}
