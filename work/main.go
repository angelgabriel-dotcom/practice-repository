package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/sashabaranov/go-openai"
)

func main() {
	fmt.Println("\033[31m")
	if len(os.Args) == 1 {
		typescript("Welcome to the Ultimate Speech Generator I Am Capable To Form Speechs And Generate Any Speech you Want either A Speech Made From Movie Or An Anime, Type any character name, and their best speech will be generated for you.")

	}
	fmt.Println("\033[0m")

	reader := bufio.NewReader(os.Stdin)
	fmt.Println("Input What You Want: Either A Character Name For His Speech Or You Want Me To Generate  A Speech Due To Input ")
	text, _ := reader.ReadString('\n')
	fmt.Println("Okay Here is What you Want \n", text+"\n")

	charaName := strings.TrimSpace(text)
	fmt.Printf("Generating %s: (Please Wait For Some Sec 😊 😊)   \n\n", charaName)

	ctx := context.Background()
	apiKey := ""

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = "https://api.groq.com/openai/v1"
	client := openai.NewClientWithConfig(config)

	prompt := fmt.Sprintf(`i want you to search the web and give the most iconic and straight answer to the %s`, charaName)

	response, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: "groq/compound-mini",
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
	})
	if err != nil {
		log.Fatal("Groq Error While Generating Speech: ", err)
	}

	var speechResult string
	if len(response.Choices) > 0 {
		speechResult = response.Choices[0].Message.Content
	}

	fmt.Println("\033[36m")
	typescript(speechResult)
	fmt.Println("\033[0m")
}
