package main

import (
	"fmt"
	"os"
	"strings"
	"time"
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()
	 router.GET("/",func(c *gin.Context){
		c.File("index.html")
	 })
	router.POST("/ascii", generateAscii)
	router.Run(":8080")

}

func generateAscii(c *gin.Context) {
	text := c.PostForm("text")

	if text == "" {
		c.JSON(400, gin.H{"error":"please input a word"})
		return
	}

	banner := c.PostForm("banner")

	if banner == "" {
		c.JSON(400, gin.H{"error": "your banner file is empty"})
		return
	}

	_, err := validate(text)
	if err != nil {
		c.JSON(400, gin.H{"error": "text contains invalid characters"})
		return
	}

	bannermap, err := loadbanner(banner + ".txt")
	if err != nil {
		c.JSON(400, gin.H{"error": "could not load banner file"})
		return
	}

	result := generate(text, bannermap)
	c.JSON(200, gin.H{"result":"loading"})
	typescript(result)
}

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

func validate(str string) (rune, error) {
	for _, ch := range str {
		if ch < 32 || ch > 126 {
			return ch, fmt.Errorf("Error Validating")
		}
	}
	return 0, nil
}
func typescript(str string) {

	for _, ch := range str {
		fmt.Printf("%c", ch)
		os.Stdout.Sync()
		time.Sleep(40 * time.Millisecond)

	}
	fmt.Println()
}
