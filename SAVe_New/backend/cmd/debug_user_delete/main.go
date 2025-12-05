package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const baseURL = "http://localhost:8080/api"

type LoginResponse struct {
	Token string `json:"token"`
}

type User struct {
	ID      int    `json:"id"`
	Email   string `json:"email"`
	Usuario string `json:"usuario"`
	Cargo   string `json:"cargo"`
	Area    string `json:"area"`
	Role    string `json:"role"`
}

func main() {
	// 1. Login
	token, err := login("msgsilva.estagio@mpmg.mp.br", "Mar@1170358")
	if err != nil {
		fmt.Printf("Login failed: %v\n", err)
		return
	}
	fmt.Println("Login successful")

	// 2. Create Dummy User
	user, err := createUser(token)
	if err != nil {
		fmt.Printf("Create failed: %v\n", err)
		return
	}
	fmt.Printf("Created user with ID: %d\n", user.ID)

	// 3. Delete User
	err = deleteUser(token, user.ID)
	if err != nil {
		fmt.Printf("Delete failed: %v\n", err)
		return
	}
	fmt.Println("Delete successful")
}

func login(email, password string) (string, error) {
	payload := map[string]string{"email": email, "password": password}
	jsonData, _ := json.Marshal(payload)

	resp, err := http.Post(baseURL+"/login", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status %d: %s", resp.StatusCode, string(body))
	}

	var result LoginResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}
	return result.Token, nil
}

func createUser(token string) (*User, error) {
	payload := map[string]string{
		"email":   fmt.Sprintf("test_delete_%d@mpmg.mp.br", time.Now().Unix()),
		"usuario": "Test Delete User",
		"cargo":   "Estagiária(o)",
		"area":    "Direito",
		"role":    "User",
	}
	jsonData, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", baseURL+"/admin/users", bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 201 {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("status %d: %s", resp.StatusCode, string(body))
	}

	var result struct {
		ID int `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &User{ID: result.ID}, nil
}

func deleteUser(token string, id int) error {
	req, _ := http.NewRequest("DELETE", fmt.Sprintf("%s/admin/users/%d", baseURL, id), nil)
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}
