package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type detail struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Age      int     `json:"age"`
	Networth float64 `json:"networth"`
	Work     string  `json:"work"`
}

var details = []detail{
	{ID: 664, Name: "jakes", Age: 19, Networth: 8788.0000, Work: "That Guy Na Fraud O But As You Don See His Details Like This Make You No Go Cast Am Abeg"},
	{ID: 362, Name: "Mmbarak Lawal", Age: 27, Networth: 8923.0000, Work: "Backend Developer"},
	{ID: 664, Name: "Idi Mohamed", Age: 19, Networth: 8787.00, Work: "Manager Of Google"},
	{ID: 362, Name: "Angel", Age: 23, Networth: 8923.0000, Work: "Frontend Developer"},
	{ID: 664, Name: "jakes", Age: 19, Networth: 8788.0000, Work: ""},
	{ID: 362, Name: "Finix", Age: 27, Networth: 8923.0000, Work: "Backend Developer"},
}

// var users map[int]string


func getdetail(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, details)
}

func getId(c *gin.Context){
	strId := c.Param("ID")
	
	id, err := strconv.Atoi(strId)
	 if err != nil{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"Error":"Error Invalid Id"})
		return
	 }

	 for _, d := range details{
		if d.ID == id{
			c.IndentedJSON(httpStatus.OK)
		}
	 }
}

func main() {
	router := gin.Default()
	router.GET("/details", getdetail)
	router.Run("localhost:9000")

	// users = map[int]string{
	// 	1: "Matheus",
	// 	2: "Jakes",
	// 	3: "Angel",
	// 	4: "finix",
	// 	5: "Idi Mohammed",
	// 	6: "Mmbarak Lawal",
	// }

	// fmt.Println(getUser(3))
	// fmt.Println(getUser(6))

}

// func getUser(userId int) string {
// 	red := "\033[31m"
// 	reset := "\033[0m"
// 	if name, ok := users[userId]; ok {
// 		return name
// 	}
// 	typescript(red + "Invalid UserID Be warned I Don't Play Here I Know You Inputed That Unpurpose Tho" + reset)
// 	return ""
// }
