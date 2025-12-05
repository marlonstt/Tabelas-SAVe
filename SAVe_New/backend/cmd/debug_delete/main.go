package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const baseURL = "http://localhost:8080/api"

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type Responsavel struct {
	ID    int    `json:"ID"`
	Nome  string `json:"Nome"`
	Cargo string `json:"Cargo"`
	Area  string `json:"Area"`
}

func main() {
	// 1. Login
	token, err := login("msgsilva.estagio@mpmg.mp.br", "Mar@1170358")
	if err != nil {
		fmt.Printf("Login failed: %v\n", err)
		return
	}
	fmt.Println("Login successful")

	// 2. Create Dummy Responsavel
	resp, err := createResponsavel(token)
	if err != nil {
		fmt.Printf("Create failed: %v\n", err)
		return
	}
	fmt.Printf("Created responsavel with ID: %d\n", resp.ID)

	// 3. Delete Responsavel
	err = deleteResponsavel(token, resp.ID)
	if err != nil {
		fmt.Printf("Delete failed: %v\n", err)
		return
	}
	fmt.Println("Delete successful")
}

func login(email, password string) (string, error) {
	reqBody, _ := json.Marshal(LoginRequest{Email: email, Password: password})
	resp, err := http.Post(baseURL+"/login", "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("status %d: %s", resp.StatusCode, string(body))
	}

	var loginResp LoginResponse
	if err := json.NewDecoder(resp.Body).Decode(&loginResp); err != nil {
		return "", err
	}
	return loginResp.Token, nil
}

func createResponsavel(token string) (*Responsavel, error) {
	respData := Responsavel{
		Nome:  "Test Delete",
		Cargo: "Outro",
		Area:  "Outro",
	}
	reqBody, _ := json.Marshal(respData)
	req, _ := http.NewRequest("POST", baseURL+"/admin/responsaveis", bytes.NewBuffer(reqBody))
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

	var createdResp Responsavel
	if err := json.NewDecoder(resp.Body).Decode(&createdResp); err != nil {
		return nil, err
	}
	return &createdResp, nil
}

func deleteResponsavel(token string, id int) error {
	req, _ := http.NewRequest("DELETE", fmt.Sprintf("%s/admin/responsaveis/%d", baseURL, id), nil)
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
