package main 

import(
	"fmt"
	"net/http"
	"io"
	"strconv"
	
)

func main(){
	http.HandleFunc("/ping", handler)
	http.HandleFunc("/hello", QueryHandler)
	http.HandleFunc("/count", CountHandler)
	http.HandleFunc("/calculate", MathHandler)
	http.HandleFunc("/agent", AgentHandler)
	http.HandleFunc("/dashboard", ApiHandler)
	http.HandleFunc("/legacy", LegacyHandler)
	http.HandleFunc("/v2", V2Handler)
	fmt.Println("live...")
	http.ListenAndServe(":8080",nil)
}

// Exercise 1: Basic Ping-Pong Server
// Goal: Build a minimal web server that listens on port 8080 and responds with "pong" when a user visits the /ping route.
// Tasks:
// Create a route handler for /ping using http.HandleFunc.
// Use w.Write() or fmt.Fprintln() to send a plain text response.
// Start the server on port :8080 using http.ListenAndServe.
func handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		if r.URL.Path != "/ping"{
			http.Error(w, "page not found", http.StatusNotFound)
			return
		}
		fmt.Fprintln(w, "pong")
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// Exercise 2: Query Parameters & Path Validation
// Goal: Create a /hello endpoint that reads a name query parameter (e.g., /hello?name=Alice) and responds with "Hello, Alice!". If the parameter is missing, default to "Hello, Guest!".
// Tasks:
// Extract query parameters using r.URL.Query().Get("name").
// Reject any HTTP method that is not GET by returning an http.StatusMethodNotAllowed status code.
func QueryHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		if r.URL.Path != "/hello"{
			http.Error(w, "page not found", http.StatusNotFound)
			return
		}
		name := r.URL.Query().Get("name")
		if name == ""{
			name = "Guest"
		}
		fmt.Fprintf(w, "Hello, %v!", name)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// Exercise 3: Text Counter (URL Variables & Methods)
// Goal: Build a server with a /count route. If a user sends a GET request, return the text "Send a POST request with text to count words". If they send a POST request, read the text body and return the number of characters.
// Key Tasks:
// Differentiate between GET and POST methods using r.Method.
// Read the entire request body using io.ReadAll(r.Body).
// Return the character length as a string.
func CountHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		if r.URL.Path != "/count"{
			http.Error(w, "page not found", http.StatusNotFound)
			return
		}
		fmt.Fprintln(w, "Send a POST request with text to count words")
	case "POST":
		data, err := io.ReadAll(r.Body)
		defer r.Body.Close()
		if err != nil{
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}
		fmt.Fprintln(w, len(data))
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// Exercise 4: Basic Math API (Multiple Query Parameters)
// Goal: Create a /calculate route that accepts three query parameters: op (operation), a, and b. For example, /calculate?op=add&a=10&b=5 should respond with Result: 15.
// Key Tasks:
// Parse string query variables using r.URL.Query().Get().
// Convert string inputs to integers using strconv.Atoi().
// Support add, subtract, and multiply. Return an HTTP 400 Bad Request if the operation is unknown or parsing fails.
func MathHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		if r.URL.Path != "/calculate"{
			http.Error(w, "page not found", http.StatusNotFound)
			return
		}
		op := r.URL.Query().Get("op")
		a := r.URL.Query().Get("a")
		b := r.URL.Query().Get("b")

		val, err := strconv.Atoi(a)
		if err != nil{
			http.Error(w, "Bad Request1", http.StatusBadRequest)
			return
		}
		data, err := strconv.Atoi(b)
		if err != nil{
			http.Error(w, "Bad Request2", http.StatusBadRequest)
			return
		}

		var result int

		switch op{
		case "add":
			result = val + data
		case "subtract":
			result = val - data
		case "multiply":
			result = val * data
		default:
			http.Error(w, "Bad Request3", http.StatusBadRequest)
		}
		fmt.Fprintln(w, result)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// Exercise 5: User-Agent Echo (Reading Headers)
// Goal: Create an /agent route that reads the incoming browser or client header details and echoes it back in plain text: "You are visiting us using: [User-Agent Info]".
// Key Tasks:
// Inspect request headers using r.Header.Get("User-Agent").
// Handle instances where the header might be missing or empty.
func AgentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		if r.URL.Path != "/agent"{
			http.Error(w, "page not found", http.StatusNotFound)
			return
		}
		agent := r.Header.Get("User-Agent")
		if agent == "" {
			http.Error(w, "page not found", http.StatusNotFound)
			return
		}
		fmt.Fprintf(w, "You Are Visiting us Using: %s", agent)
	}
	if r.Method != "GET" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

// Exercise 5: Secure Dashboard (Simple Authorization Headers)
// Goal: Create a /dashboard route that acts as a protected page. If the client does not provide a specific API key in their headers, block them.
// Key Tasks:
// Read custom headers using r.Header.Get("X-API-Key").
// Match it against a hardcoded value (e.g., secret123).
// Use http.StatusUnauthorized (401) to reject bad keys.
func ApiHandler(x http.ResponseWriter, y *http.Request) {
	if y.Method == "GET" {
		if y.URL.Path != "/dashboard" {
			http.Error(x, "page not found", http.StatusNotFound)
			return
		}
		api := y.Header.Get("X-API-Key")
		if api != "secret123" {
			http.Error(x, "unauthorized access", http.StatusUnauthorized)
			return
		}
		fmt.Fprintln(x, "Welcome")
	}
	if y.Method != "GET" {
		http.Error(x, "method not allowed", http.StatusMethodNotAllowed)
		return
	}	
}

// Exercise 6: Simple Redirector (Status Codes)
// Goal: Create a /legacy route. Whenever a user hits this endpoint, permanently redirect them to a new route /v2 with a friendly "Welcome to version 2" message.
// Key Tasks:
// Redirect traffic using the http.Redirect helper function.
// Use the proper status code for a permanent move (http.StatusMovedPermanently).
func LegacyHandler(x http.ResponseWriter, y *http.Request) {
	if y.Method == "GET" {
		if y.URL.Path != "/legacy" {
			http.Error(x, "page not found", http.StatusNotFound)
			return
		}
		http.Redirect(x, y, "http://localhost:8080/v2", http.StatusMovedPermanently)
	}
}
func V2Handler(x http.ResponseWriter, y *http.Request) {
	if y.Method == "GET" {
		if y.URL.Path != "/v2" {
			http.Error(x, "page not found", http.StatusNotFound)
			return
		}
		fmt.Fprintln(x, "Welcome to version 2")
	}
}