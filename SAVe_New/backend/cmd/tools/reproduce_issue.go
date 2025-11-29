package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

const baseURL = "http://localhost:8080/api"

type LoginResponse struct {
	Token string `json:"token"`
}

func main() {
	// 1. Login
	loginData := map[string]string{"email": "admin", "password": "admin"}
	jsonData, _ := json.Marshal(loginData)
	resp, err := http.Post(baseURL+"/login", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Login failed:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := ioutil.ReadAll(resp.Body)
		fmt.Printf("Login failed with status %d: %s\n", resp.StatusCode, string(body))
		return
	}

	var loginResp LoginResponse
	json.NewDecoder(resp.Body).Decode(&loginResp)
	token := loginResp.Token
	fmt.Println("Logged in, token obtained.")

	// 2. Update Dados de Entrada (Case ID 1)
	caseID := 1
	updateData := map[string]interface{}{
		"Data":                    "2025-11-29",
		"Comarca_origem":          "Belo Horizonte",
		"N_procedimento_MPE":      "TEST-123",
		"Quem_encaminha":          "MPMG",
		"PE_nome":                 "Dr. Teste",
		"Precisa_Atendimento_Esp": "Sim",
		"Atendimento_Especial":    "Teste Especial",
		"Tipo_Vitima":             "Mulher", // New value
		"Classificacao_vitima":    "Idoso",  // Old value (simulated)
		"Vitimizacao":             "Primária",
		"Classificacao_crime":     "Tentado",
		"crimes":                  []string{"Ameaça", "Lesão Corporal"},
		"Observacao":              "Teste de observação",
	}
	jsonData, _ = json.Marshal(updateData)

	req, _ := http.NewRequest("PUT", fmt.Sprintf("%s/cases/%d/dados-entrada", baseURL, caseID), bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err = client.Do(req)
	if err != nil {
		fmt.Println("Update failed:", err)
		return
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Printf("Update Status: %d\nResponse: %s\n", resp.StatusCode, string(body))

	// 3. Verify Data
	req, _ = http.NewRequest("GET", fmt.Sprintf("%s/cases/%d", baseURL, caseID), nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err = client.Do(req)
	if err != nil {
		fmt.Println("Get failed:", err)
		return
	}
	defer resp.Body.Close()

	body, _ = ioutil.ReadAll(resp.Body)
	fmt.Printf("Get Status: %d\n", resp.StatusCode)

	// Parse response to check dadosEntrada
	var caseData struct {
		DadosEntrada map[string]interface{} `json:"dadosEntrada"`
	}
	json.Unmarshal(body, &caseData)
	fmt.Printf("Classificacao_vitima: %v\n", caseData.DadosEntrada["Classificacao_vitima"])
}
