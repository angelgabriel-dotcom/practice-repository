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

	apiKey := ""
	config := openai.DefaultConfig(apiKey)
	config.BaseURL = "https://api.groq.com/openai/v1"
	client := openai.NewClientWithConfig(config)
	reader := bufio.NewReader(os.Stdin)

	for {
		fmt.Println("\nInput What You Want: Either A Character Name For His Speech Or You Want Me To Generate A Speech Due To Input")
		fmt.Println("(Type 'exit' or 'done' to quit)")

		text, _ := reader.ReadString('\n')
		charaName := strings.TrimSpace(text)

		// Exit condition
		if strings.EqualFold(charaName, "exit") || strings.EqualFold(charaName, "done") || strings.EqualFold(charaName, "quit") {
			fmt.Println("\033[31m")
			typescript("Farewell! May your words carry the power of a true speech.")
			fmt.Println("\033[0m")
			break
		}

		if charaName == "" {
			fmt.Println("Please enter something!")
			continue
		}

		fmt.Println("Okay Here is What you Want \n", charaName+"\n")
		fmt.Printf("Generating %s: (Please Wait For Some Sec 😊 😊)   \n\n", charaName)

		ctx := context.Background()
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
			fmt.Println("\033[33mGroq Error While Generating Speech:", err, "\033[0m")
			continue // don't crash, just loop again
		}

		var speechResult string
		if len(response.Choices) > 0 {
			speechResult = response.Choices[0].Message.Content
		}

		fmt.Println("\033[36m")
		typescript(speechResult)
		fmt.Println("\033[0m")
	}
}
