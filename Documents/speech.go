package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {

	yellow := "\033[33m"
	reset := "\033[0m"
	red := "\033[31"
	mainspeech := yellow + `Wake up to reality!
Nothing ever goes as planned in this accursed world.
The longer you live, the more you realize that the only things that truly exist in this reality are merely pain, suffering, and futility.

Listen… everywhere you look in this world, wherever there is light, there will always be shadows to be found as well.
As long as there is a concept of victors, the vanquished will also exist.

The selfish intent of wanting to preserve peace initiates wars…
and hatred is born in order to protect love.

There are nexuses, causal relationships that cannot be separated.

I want to sever the fate of this world…
A world of only victors…
A world of only peace…
A world of only love.

I will create such a world.` + reset

	reader := bufio.NewReader(os.Stdin)
	fmt.Print("input name: ")
	text, _ := reader.ReadString('\n')
	fmt.Print("you typed\n", text+"\n")

	var speech string
	fmt.Print(yellow+"Since you mentioned the Ghost of the uchiha can you tell me his speech?\n", reset)
	fmt.Scanln(&speech)

	if speech != mainspeech {
		fmt.Print(red+" WRONG: Wait let me correct you, you are not an ANIME fan that's why you don't know it\n", reset)
	}
	fmt.Println(mainspeech)
}
