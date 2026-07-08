package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

func main() {
	http.HandleFunc("/ascii", generateAscii)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})
	fmt.Println("Live And Listening Now On Port 8080")
	http.ListenAndServe(":8080", nil)
}

func generateAscii(w http.ResponseWriter, r *http.Request) {
	text := r.FormValue("text")
	if text == "" {
		http.Error(w, "Error: text is empty", http.StatusBadRequest)
		return
	}
	banner := r.FormValue("banner")
	if banner == "" {
		http.Error(w, "Error: empty banner", http.StatusBadRequest)
		return
	}

	_, err := validate(text)
	if err != nil {
		http.Error(w, "Error: validating text", http.StatusBadRequest)
		return
	}
	bannermap, err := loadbanner(banner + ".txt")
	if err != nil {
		http.Error(w, "Error trying to loadbanner", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	result := generate(text, bannermap)
	response := map[string]string{"result": result}
	json.Marshal(response)
	data, _ := json.Marshal(response)
	fmt.Fprintf(w, string(data))

}

// func albums(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		http.Error(w, "error bad request", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	fmt.Fprint(w, "hello world of programmers")
// }

func loadbanner(str string) (map[rune][]string, error) {

	data, err := os.ReadFile(str)
	if err != nil {
		return nil, fmt.Errorf("error reading file")
	}

	file := string(data)
	files := strings.Split(file, "\n")

	if len(files) == 0 {
		return nil, fmt.Errorf("your current files is empty")
	}

	if len(files) != 855 {
		return nil, fmt.Errorf("error: lenght of file should be 855\ncurrent lenght of file now is %d\n", len(files))
	}

	mapp := map[rune][]string{}

	for ch := 32; ch <= 126; ch++ {
		start := (ch-32)*9 + 1
		end := start + 8
		mapp[rune(ch)] = files[start:end]
	}
	return mapp, nil
}

func render(str string, banner map[rune][]string) []string {
	file := make([]string, 8)
	for row := 0; row < 8; row++ {
		var res strings.Builder
		for _, ch := range str {
			res.WriteString(banner[ch][row])
		}
		file[row] = res.String()
	}
	return file
}

func generate(str string, banner map[rune][]string) string {
	if str == "" {
		return ""
	}

	var res strings.Builder
	parts := strings.Split(str, "\\n")

	for i, ch := range parts {
		if ch == "" {
			if i < len(parts)-1 {
				res.WriteString("\n")
			}
		} else {
			row := render(ch, banner)
			for _, v := range row {
				res.WriteString(v + "\n")
			}
		}
	}
	return res.String()
}

func validate(str string) (rune, error) {
	for _, ch := range str {
		if ch < 32 || ch > 126 {
			return ch, fmt.Errorf("Error Validating")
		}
	}
	return 0, nil
}
