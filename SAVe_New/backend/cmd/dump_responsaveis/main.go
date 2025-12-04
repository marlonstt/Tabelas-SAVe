package main

import (
	"fmt"
	"os"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()
	var responsaveis []models.SAVe_Responsaveis
	database.DB.Find(&responsaveis)

	f, _ := os.Create("responsaveis_dump.txt")
	defer f.Close()

	fmt.Fprintln(f, "--- SAVe_Responsaveis ---")
	for _, r := range responsaveis {
		fmt.Fprintf(f, "ID: %d, Nome: '%s', Area: '%s'\n", r.ID, r.Nome, r.Area)
	}
}
