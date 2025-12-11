package main

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	password := "Mar@1170358"

	// Gerar hash bcrypt
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Erro ao gerar hash:", err)
		return
	}

	fmt.Println("Senha:", password)
	fmt.Println("Hash bcrypt:")
	fmt.Println(string(hash))

	// Verificar se o hash está correto
	err = bcrypt.CompareHashAndPassword(hash, []byte(password))
	if err != nil {
		fmt.Println("ERRO: Hash não corresponde à senha!")
	} else {
		fmt.Println("✓ Hash verificado com sucesso!")
	}
}
