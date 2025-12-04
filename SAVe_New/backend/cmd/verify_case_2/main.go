package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
	"strings"
)

func main() {
	database.Connect()

	// 1. Fetch Responsaveis and build map
	var responsaveis []models.SAVe_Responsaveis
	database.DB.Find(&responsaveis)
	respMap := make(map[string]string)
	for _, r := range responsaveis {
		respMap[strings.TrimSpace(r.Nome)] = strings.TrimSpace(r.Area)
	}

	// 2. Fetch Acompanhamentos for Case 2
	var acomps []models.SAVe_Acompanhamentos
	database.DB.Where("\"ID_Caso\" = ?", 2).Find(&acomps)

	// 3. Run logic
	psicoSet := make(map[string]bool)
	juridicoSet := make(map[string]bool)

	for _, a := range acomps {
		if a.Responsaveis == "" {
			continue
		}
		names := strings.Split(a.Responsaveis, ",")
		for _, name := range names {
			name = strings.TrimSpace(name)
			if name == "" {
				continue
			}
			area, exists := respMap[name]
			if exists {
				if area == "Psicossocial" {
					psicoSet[name] = true
				} else if area == "Direito" {
					juridicoSet[name] = true
				}
			} else {
				fmt.Printf("WARNING: Name '%s' not found in map\n", name)
			}
		}
	}

	fmt.Println("--- Results for Case 2 ---")
	fmt.Printf("Psicossocial: %v\n", psicoSet)
	fmt.Printf("Juridico: %v\n", juridicoSet)
}
