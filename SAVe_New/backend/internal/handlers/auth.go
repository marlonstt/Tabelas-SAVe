package handlers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"save-backend/internal/database"
	"save-backend/internal/middleware"
	"save-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Mock data storage
var mockUsers = []models.SAVe_Usuarios{
	{ID: 1, Email: "admin@mpmg.mp.br", Password: "$2a$10$YourHashedPasswordHere", Usuario: "Admin Mock", Role: "Admin", Cargo: "Promotora(o)", Area: "Direito"},
	{ID: 2, Email: "user@mpmg.mp.br", Password: "$2a$10$YourHashedPasswordHere", Usuario: "User Mock", Role: "User", Cargo: "Assessora(o)", Area: "Psicossocial"},
}

func init() {
	// Pre-hash passwords for mock users (123456)
	hash, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	mockUsers[0].Password = string(hash)
	mockUsers[1].Password = string(hash)
}

func Login(c *gin.Context) {
	fmt.Fprintf(os.Stderr, "LOGIN HANDLER CALLED\n")
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.SAVe_Usuarios
	var found bool

	// MOCK MODE CHECK
	if !database.Connected {
		fmt.Fprintf(os.Stderr, "DEBUG_HIT: MOCK MODE: Attempting login for: %s\n", input.Email)
		for _, u := range mockUsers {
			if u.Email == input.Email {
				user = u
				found = true
				break
			}
		}
		if !found {
			fmt.Fprintf(os.Stderr, "DEBUG_HIT: MOCK MODE: User not found\n")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Email ou senha incorretos (Mock)"})
			return
		}
		fmt.Fprintf(os.Stderr, "DEBUG_HIT: MOCK MODE: User found. Comparing password.\n")
		// Compare password
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
			fmt.Fprintf(os.Stderr, "DEBUG_HIT: MOCK MODE: Password mismatch: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Email ou senha incorretos (Mock)"})
			return
		}
		fmt.Fprintf(os.Stderr, "DEBUG_HIT: MOCK MODE: Login successful\n")
	} else {
		fmt.Fprintf(os.Stderr, "DEBUG_HIT: REAL MODE: Attempting login for: %s\n", input.Email)
		if err := database.DB.Where("Email = ?", input.Email).First(&user).Error; err != nil {
			fmt.Fprintf(os.Stderr, "DEBUG_HIT: REAL MODE: User not found in DB: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Sprintf("DEBUG: User not found in DB: %v", err)})
			return
		}
		fmt.Fprintf(os.Stderr, "DEBUG_HIT: REAL MODE: User found: %s Role: %s\n", user.Email, user.Role)
		fmt.Fprintf(os.Stderr, "DEBUG_HIT: REAL MODE: Stored Hash: %s\n", user.Password)

		// Compare password
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
			fmt.Fprintf(os.Stderr, "DEBUG_HIT: REAL MODE: Password mismatch error: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Sprintf("DEBUG: Password mismatch: %v", err)})
			return
		}
		fmt.Fprintf(os.Stderr, "DEBUG_HIT: REAL MODE: Password match successful\n")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 8).Unix(),
	})

	tokenString, err := token.SignedString(middleware.SecretKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":                   user.ID,
			"email":                user.Email,
			"role":                 user.Role,
			"usuario":              user.Usuario,
			"cargo":                user.Cargo,
			"area":                 user.Area,
			"must_change_password": user.MustChangePassword,
			"profile_image":        user.ProfileImage,
		},
	})
}

func Register(c *gin.Context) {
	var input struct {
		Email   string `json:"email"`
		Cargo   string `json:"cargo"`
		Usuario string `json:"usuario"`
		Area    string `json:"area"`
		Role    string `json:"role"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Hash default password "123456"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)

	newUser := models.SAVe_Usuarios{
		Email:              input.Email,
		Password:           string(hashedPassword),
		Cargo:              input.Cargo,
		Usuario:            input.Usuario,
		Area:               input.Area,
		Role:               input.Role,
		MustChangePassword: true,
	}

	if !database.Connected {
		// Check if user exists in mock
		for _, u := range mockUsers {
			if u.Email == input.Email {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Email já cadastrado (Mock)"})
				return
			}
		}
		// Generate Mock ID
		newUser.ID = int(len(mockUsers) + 1)
		mockUsers = append(mockUsers, newUser)
		c.JSON(http.StatusCreated, gin.H{"message": "User created successfully (Mock)", "id": newUser.ID})
		return
	}

	// Check if user exists
	var existingUser models.SAVe_Usuarios
	if err := database.DB.Where("Email = ?", input.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email já cadastrado"})
		return
	}

	if err := database.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "id": newUser.ID})
}

func UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var input struct {
		Email   string `json:"email"`
		Cargo   string `json:"cargo"`
		Usuario string `json:"usuario"`
		Area    string `json:"area"`
		Role    string `json:"role"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if !database.Connected {
		var foundIndex = -1
		for i, u := range mockUsers {
			if int(u.ID) == id {
				foundIndex = i
				break
			}
		}
		if foundIndex == -1 {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found (Mock)"})
			return
		}

		// Update mock user
		mockUsers[foundIndex].Email = input.Email
		mockUsers[foundIndex].Cargo = input.Cargo
		mockUsers[foundIndex].Usuario = input.Usuario
		mockUsers[foundIndex].Area = input.Area
		mockUsers[foundIndex].Role = input.Role

		c.JSON(http.StatusOK, mockUsers[foundIndex])
		return
	}

	var user models.SAVe_Usuarios
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Check email uniqueness if changed
	if input.Email != "" && input.Email != user.Email {
		var existingUser models.SAVe_Usuarios
		if err := database.DB.Where("Email = ? AND ID != ?", input.Email, id).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email já cadastrado"})
			return
		}
	}

	user.Email = input.Email
	user.Cargo = input.Cargo
	user.Usuario = input.Usuario
	user.Area = input.Area
	user.Role = input.Role

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func ChangePassword(c *gin.Context) {
	userID, _ := c.Get("userID")
	var input struct {
		CurrentPassword string `json:"currentPassword"`
		NewPassword     string `json:"newPassword"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if !database.Connected {
		// Mock change password
		uid := 0
		switch v := userID.(type) {
		case float64:
			uid = int(v)
		case uint:
			uid = int(v)
		case int:
			uid = v
		}

		for i, u := range mockUsers {
			if int(u.ID) == uid {
				// Verify current password
				if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(input.CurrentPassword)); err != nil {
					c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha atual incorreta (Mock)"})
					return
				}
				// Update
				hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
				mockUsers[i].Password = string(hashedPassword)
				mockUsers[i].MustChangePassword = false
				c.JSON(http.StatusOK, gin.H{"message": "Senha alterada com sucesso (Mock)"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found (Mock)"})
		return
	}

	var user models.SAVe_Usuarios
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Senha atual incorreta"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	user.MustChangePassword = false

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha alterada com sucesso"})
}

func UpdateProfileImage(c *gin.Context) {
	userID, _ := c.Get("userID")
	var input struct {
		ProfileImage string `json:"profileImage"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if !database.Connected {
		// Mock update profile image
		uid := 0
		switch v := userID.(type) {
		case float64:
			uid = int(v)
		case uint:
			uid = int(v)
		case int:
			uid = v
		}

		for i, u := range mockUsers {
			if int(u.ID) == uid {
				mockUsers[i].ProfileImage = input.ProfileImage
				c.JSON(http.StatusOK, gin.H{"message": "Foto de perfil atualizada com sucesso (Mock)"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found (Mock)"})
		return
	}

	var user models.SAVe_Usuarios
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.ProfileImage = input.ProfileImage

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Foto de perfil atualizada com sucesso", "profile_image": user.ProfileImage})
}

func GetUsers(c *gin.Context) {
	if !database.Connected {
		c.JSON(http.StatusOK, mockUsers)
		return
	}
	var users []models.SAVe_Usuarios
	if err := database.DB.Order("Usuario asc").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if !database.Connected {
		var foundIndex = -1
		for i, u := range mockUsers {
			if int(u.ID) == id {
				foundIndex = i
				break
			}
		}
		if foundIndex != -1 {
			// Remove from slice
			mockUsers = append(mockUsers[:foundIndex], mockUsers[foundIndex+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully (Mock)"})
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found (Mock)"})
		}
		return
	}

	if err := database.DB.Delete(&models.SAVe_Usuarios{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
