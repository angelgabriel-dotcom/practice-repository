package main

func findLargest(numbers []int) int {
	largest := numbers[0]
	for i := 1; i < len(numbers); i++ {
		if numbers[i] > largest {
			largest = numbers[i]
		}
	}
	return largest
}
func finndSmallest(numbers []int) int {
	smallest := numbers[0]
	for i := 1; i < len(numbers); i++ {
		if numbers[i] < smallest {
			smallest = numbers[i]
		}
	}
	return smallest
}

// func main() {
// 	fmt.Println(findLargest([]int{6, 7, 9, 8, 500, 83, 5}))
// 	fmt.Println(finndSmallest([]int{6, 7, 9, 8, 500, 83, 5, 4, 3, 2, 1}))
// }
