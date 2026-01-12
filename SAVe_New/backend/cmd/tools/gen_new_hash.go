package main

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	password := "123456"

	// 1. Generate Hash
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	// 2. Verify Hash
	if err := bcrypt.CompareHashAndPassword(hash, []byte(password)); err != nil {
		panic("Verification failed")
	}

	// 3. Write to file
	os.WriteFile("hash.txt", hash, 0644)
	fmt.Println("Hash written to hash.txt")
}
