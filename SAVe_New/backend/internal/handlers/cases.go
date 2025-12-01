package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"save-backend/internal/database"
	"save-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm" // Import gorm for ErrRecordNotFound
)

func GetAllCases(c *gin.Context) {
	var cases []models.SAVe_Geral
	// Use quoted identifier for case-sensitive column
	if err := database.DB.Order("\"ID_Caso\" desc").Find(&cases).Error; err != nil {
		fmt.Println("Error fetching cases:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching cases"})
		return
	}
	fmt.Printf("GetAllCases: Found %d cases\n", len(cases))
	c.JSON(http.StatusOK, cases)
}

func GetCaseById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var geral models.SAVe_Geral
	if err := database.DB.First(&geral, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Case not found"})
		return
	}

	var dadosEntrada models.SAVe_DadosDeEntrada
	database.DB.First(&dadosEntrada, id)

	var identificacao models.SAVe_Identificacao
	database.DB.First(&identificacao, id)

	var telefones []models.SAVe_Identificacao_telefone
	database.DB.Where("\"ID_Caso\" = ?", id).Find(&telefones)

	var emails []models.SAVe_Identificacao_email
	database.DB.Where("\"ID_Caso\" = ?", id).Find(&emails)

	var enderecos []models.SAVe_Identificacao_endereco
	database.DB.Where("\"ID_Caso\" = ?", id).Find(&enderecos)

	var casosVinculados models.SAVe_Casos_Vinculados
	database.DB.First(&casosVinculados, id)

	// Add other tables here...
	var encerramento models.SAVe_Encerramento
	database.DB.First(&encerramento, id)

	var agressores []models.SAVe_Agressor
	database.DB.Where("\"ID_Caso\" = ?", id).Find(&agressores)

	var situacaoJuridica models.SAVe_Situacao_Juridica
	database.DB.First(&situacaoJuridica, id)

	var situacaoJuridica2 models.SAVe_Situacao_Juridica2
	database.DB.First(&situacaoJuridica2, id)

	var situacaoJuridicaIP []models.SAVe_Situacao_Juridica_Incluir_processo
	database.DB.Where("\"ID_Caso\" = ?", id).Find(&situacaoJuridicaIP)

	var saude models.SAVe_Saude
	if err := database.DB.Where("\"ID_Caso\" = ?", id).First(&saude).Error; err != nil {
		// Handle error or ignore if record not found
	}

	var habitacaoTerritorio models.SAVe_Habitacao_territorio
	if err := database.DB.Where("\"ID_Caso\" = ?", id).First(&habitacaoTerritorio).Error; err != nil {
		// Handle error or ignore if record not found
	}

	var assistencia models.SAVe_Assistencia
	if err := database.DB.Where("\"ID_Caso\" = ?", id).First(&assistencia).Error; err != nil {
		// Handle error or ignore if record not found
	}

	var ensinoTrabRenda models.SAVe_Ensino_trab_renda
	if err := database.DB.Where("\"ID_Caso\" = ?", id).First(&ensinoTrabRenda).Error; err != nil {
		// Handle error or ignore if record not found
	}

	var vinculos models.SAVe_Vinculos
	if err := database.DB.Where("\"ID_Caso\" = ?", id).First(&vinculos).Error; err != nil {
		// Handle error or ignore
	}

	var vinculosApoio []models.SAVe_Vinculos_Apoio
	database.DB.Where("\"ID_Caso\" = ?", id).Find(&vinculosApoio)

	var protecaoSeguranca models.SAVe_protecao_seguranca
	if err := database.DB.Where("\"ID_Caso\" = ?", id).First(&protecaoSeguranca).Error; err != nil {
		if err != gorm.ErrRecordNotFound {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching protecao seguranca"})
			return
		}
	}

	var ameacadores []models.SAVe_protecao_seguranca_ameacadores
	if err := database.DB.Where("\"ID_Caso\" = ?", id).Find(&ameacadores).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching ameacadores"})
		return
	}

	var adolescentes []models.SAVe_protecao_seguranca_adolescente
	if err := database.DB.Where("\"ID_Caso\" = ?", id).Find(&adolescentes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching adolescentes"})
		return
	}

	var acompanhamentos []models.SAVe_Acompanhamentos
	if err := database.DB.Where("\"ID_Caso\" = ?", id).Find(&acompanhamentos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching acompanhamentos"})
		return
	}

	var vitimizacao models.SAVe_Vitimizacao
	if err := database.DB.Where("\"ID_Caso\" = ?", id).First(&vitimizacao).Error; err != nil {
		// Handle error or ignore if record not found (it might not exist yet)
	}

	var sinteseAnalitica models.SAVe_SinteseAnalitica
	if err := database.DB.Where("\"ID_Caso\" = ?", id).First(&sinteseAnalitica).Error; err != nil {
		// Handle error or ignore
	}

	c.JSON(http.StatusOK, gin.H{
		"geral":               geral,
		"dadosEntrada":        dadosEntrada,
		"identificacao":       identificacao,
		"telefones":           telefones,
		"emails":              emails,
		"enderecos":           enderecos,
		"casosVinculados":     casosVinculados,
		"encerramento":        encerramento,
		"agressor":            agressores,
		"situacaoJuridica":    situacaoJuridica,
		"situacaoJuridica2":   situacaoJuridica2,
		"processos":           situacaoJuridicaIP,
		"saude":               saude,
		"habitacaoTerritorio": habitacaoTerritorio,
		"assistencia":         assistencia,
		"ensinoTrabRenda":     ensinoTrabRenda,
		"vinculos":            vinculos,
		"vinculosApoio":       vinculosApoio,
		"protecaoSeguranca":   protecaoSeguranca,
		"ameacadores":         ameacadores,
		"adolescentes":        adolescentes,
		"acompanhamentos":     acompanhamentos,
		"vitimizacao":         vitimizacao,
		"sinteseAnalitica":    sinteseAnalitica,
	})
}

func CreateCase(c *gin.Context) {
	// Start transaction
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Lock the table to ensure sequential IDs (strict Max+1)
	// This prevents race conditions where two requests get the same Max ID
	// if err := tx.Exec("LOCK TABLE \"SAVe_Geral\" IN EXCLUSIVE MODE").Error; err != nil {
	// 	tx.Rollback()
	// 	fmt.Println("Error locking table:", err) // Log error
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to lock table: " + err.Error()})
	// 	return
	// }
	fmt.Println("Skipping table lock for debugging")

	// 1. Get max ID safely under lock
	var maxID *int
	if err := tx.Model(&models.SAVe_Geral{}).Select("max(\"ID_Caso\")").Scan(&maxID).Error; err != nil {
		tx.Rollback()
		fmt.Println("Error getting max ID:", err) // Log error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get max ID: " + err.Error()})
		return
	}

	currentMax := 0
	if maxID != nil {
		currentMax = *maxID
	}
	newID := currentMax + 1

	// Bind JSON body
	var input struct {
		Tipo_Form string `json:"Tipo_Form"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		// If binding fails, default to empty or handle error.
		// For now, we proceed with default if empty, but logging might be good.
		fmt.Println("Warning: No JSON body or invalid format, using defaults")
	}

	newCase := models.SAVe_Geral{
		ID_Caso:   newID,
		Encerrado: "Não",
		Nome:      "Novo Caso", // Default name to ensure visibility
		Data:      "",          // Empty date initially
		Tipo_Form: input.Tipo_Form,
	}

	if err := tx.Create(&newCase).Error; err != nil {
		tx.Rollback()
		fmt.Println("Error creating case:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create case: " + err.Error()})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": newID, "message": "Case created"})
}

func DeleteCase(c *gin.Context) {
	// Check for Admin role
	role, exists := c.Get("userRole")
	if !exists || (role != "Admin" && role != "admin") {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// Start transaction
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Delete from dependent tables first (Cascading Delete Manual)
	// 1. Identificacao related tables (1:N)
	if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Identificacao_telefone{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete phones"})
		return
	}
	if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Identificacao_email{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete emails"})
		return
	}
	if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Identificacao_endereco{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete addresses"})
		return
	}

	// 2. Identificacao (1:1)
	if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Identificacao{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete identificacao"})
		return
	}

	// 3. DadosDeEntrada (1:1)
	if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_DadosDeEntrada{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete dados de entrada"})
		return
	}

	// 4. Casos Vinculados (1:1)
	if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Casos_Vinculados{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete casos vinculados"})
		return
	}

	// 5. Main Table (SAVe_Geral)
	if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Geral{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete case"})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Case deleted successfully"})
}

func ArchiveCase(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var encerramento models.SAVe_Encerramento
	if err := c.ShouldBindJSON(&encerramento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	encerramento.ID_Caso = id

	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// 1. Update SAVe_Geral Encerrado = "Sim"
	if err := tx.Model(&models.SAVe_Geral{}).Where("\"ID_Caso\" = ?", id).Update("Encerrado", "Sim").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update case status"})
		return
	}

	// 2. Save Encerramento data (Create or Update)
	var count int64
	tx.Model(&models.SAVe_Encerramento{}).Where("\"ID_Caso\" = ?", id).Count(&count)
	if count > 0 {
		if err := tx.Model(&models.SAVe_Encerramento{}).Where("\"ID_Caso\" = ?", id).Updates(&encerramento).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update encerramento data"})
			return
		}
	} else {
		if err := tx.Create(&encerramento).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create encerramento data"})
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Case archived successfully"})
}

func UpdateCaseSection(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	section := c.Param("section")

	switch section {
	case "dados-entrada":
		var input struct {
			models.SAVe_DadosDeEntrada
			Crimes            []string `json:"crimes"`
			CasosRelacionados []struct {
				IDVitima string `json:"id_vitima"`
			} `json:"casosRelacionados"`
			TipoVitima string `json:"Tipo_Vitima"` // Frontend uses Tipo_Vitima
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Map frontend fields to model
		input.SAVe_DadosDeEntrada.ID_Caso = id

		// Map Tipo_Vitima to Classificacao_vitima
		// Always use TipoVitima if provided, as it represents the user's selection in the frontend
		if input.TipoVitima != "" {
			input.SAVe_DadosDeEntrada.Classificacao_vitima = input.TipoVitima
		}

		// 1. Crimes -> Crime_relacionado (Semicolon separated string)
		if len(input.Crimes) > 0 {
			// Join with "; " to match PowerApps format
			joinedCrimes := ""
			for i, crime := range input.Crimes {
				if i > 0 {
					joinedCrimes += "; "
				}
				joinedCrimes += crime
			}
			input.SAVe_DadosDeEntrada.Crime_relacionado = joinedCrimes
		}

		// Start Transaction
		tx := database.DB.Begin()

		// 2. Save SAVe_DadosDeEntrada
		var count int64
		tx.Model(&models.SAVe_DadosDeEntrada{}).Where("\"ID_Caso\" = ?", id).Count(&count)

		if count == 0 {
			if err := tx.Create(&input.SAVe_DadosDeEntrada).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create dados de entrada"})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_DadosDeEntrada{}).Where("\"ID_Caso\" = ?", id).Updates(&input.SAVe_DadosDeEntrada).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update dados de entrada"})
				return
			}
		}

		// 3. Save SAVe_Casos_Vinculados
		if len(input.CasosRelacionados) > 0 {
			importJson, _ := json.Marshal(input.CasosRelacionados)
			casosVinculados := models.SAVe_Casos_Vinculados{
				ID_Caso:            id,
				Casos_Relacionados: string(importJson),
			}

			var cvCount int64
			tx.Model(&models.SAVe_Casos_Vinculados{}).Where("\"ID_Caso\" = ?", id).Count(&cvCount)
			if cvCount == 0 {
				if err := tx.Create(&casosVinculados).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create casos vinculados"})
					return
				}
			} else {
				if err := tx.Model(&models.SAVe_Casos_Vinculados{}).Where("\"ID_Caso\" = ?", id).Updates(&casosVinculados).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update casos vinculados"})
					return
				}
			}
		}

		// 4. Update SAVe_Geral fields
		updates := map[string]interface{}{}
		if input.SAVe_DadosDeEntrada.Data != "" {
			updates["Data"] = input.SAVe_DadosDeEntrada.Data
		}
		if input.SAVe_DadosDeEntrada.Comarca_origem != "" {
			updates["Comarca"] = input.SAVe_DadosDeEntrada.Comarca_origem
		}
		if input.TipoVitima != "" {
			updates["Tipo_Vitima"] = input.TipoVitima
		}
		// Update Tipo_Crime in SAVe_Geral
		// PowerApps logic uses the specific crimes (Crime_relacionado_especifico) + classification
		tipoCrime := input.SAVe_DadosDeEntrada.Crime_relacionado_especifico
		if tipoCrime == "" {
			tipoCrime = input.SAVe_DadosDeEntrada.Crime_relacionado
		}

		if input.SAVe_DadosDeEntrada.Classificacao_crime != "" {
			tipoCrime += " (" + input.SAVe_DadosDeEntrada.Classificacao_crime + ")"
		}
		if tipoCrime != "" {
			updates["Tipo_Crime"] = tipoCrime
		}
		if input.SAVe_DadosDeEntrada.N_procedimento_MPE != "" {
			updates["Num_Processo"] = input.SAVe_DadosDeEntrada.N_procedimento_MPE
		}

		if len(updates) > 0 {
			if err := tx.Model(&models.SAVe_Geral{}).Where("\"ID_Caso\" = ?", id).Updates(updates).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update geral info"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Dados de entrada updated"})

	case "identificacao":
		var input struct {
			models.SAVe_Identificacao
			Enderecos []models.SAVe_Identificacao_endereco `json:"enderecos"`
			Telefones []models.SAVe_Identificacao_telefone `json:"telefones"`
			Emails    []models.SAVe_Identificacao_email    `json:"emails"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		input.SAVe_Identificacao.ID_Caso = id

		tx := database.DB.Begin()

		// 1. Save SAVe_Identificacao
		var count int64
		tx.Model(&models.SAVe_Identificacao{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input.SAVe_Identificacao).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create identificacao"})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_Identificacao{}).Where("\"ID_Caso\" = ?", id).Updates(&input.SAVe_Identificacao).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update identificacao"})
				return
			}
		}

		// 2. Update SAVe_Geral Nome if Nome_RC is present
		if input.SAVe_Identificacao.Nome_RC != "" {
			if err := tx.Model(&models.SAVe_Geral{}).Where("\"ID_Caso\" = ?", id).Update("Nome", input.SAVe_Identificacao.Nome_RC).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update geral name"})
				return
			}
		}

		// 3. Save Enderecos (Delete all and recreate)
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Identificacao_endereco{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old addresses"})
			return
		}
		for _, end := range input.Enderecos {
			end.ID_Caso = id
			end.ID = 0 // Ensure new ID
			if err := tx.Create(&end).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create address"})
				return
			}
		}

		// 4. Save Telefones (Delete all and recreate)
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Identificacao_telefone{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old phones"})
			return
		}
		for _, tel := range input.Telefones {
			tel.ID_Caso = id
			tel.ID = 0
			if err := tx.Create(&tel).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create phone"})
				return
			}
		}

		// 5. Save Emails (Delete all and recreate)
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Identificacao_email{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old emails"})
			return
		}
		for _, em := range input.Emails {
			em.ID_Caso = id
			em.ID = 0
			if err := tx.Create(&em).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create email"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Identificacao updated"})

	case "situacao-juridica":
		fmt.Println("Received situacao-juridica update request")
		var input struct {
			models.SAVe_Situacao_Juridica
			SituacaoJuridica2 models.SAVe_Situacao_Juridica2                   `json:"situacaoJuridica2"`
			Processos         []models.SAVe_Situacao_Juridica_Incluir_processo `json:"processos"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			fmt.Println("Error binding JSON:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Printf("Bound input: %+v\n", input)

		input.SAVe_Situacao_Juridica.ID_Caso = id
		input.SituacaoJuridica2.ID_Caso = id

		tx := database.DB.Begin()

		// 1. Save SAVe_Situacao_Juridica
		input.SAVe_Situacao_Juridica.ID_Caso = id // Ensure ID_Caso is set
		var count int64
		tx.Model(&models.SAVe_Situacao_Juridica{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input.SAVe_Situacao_Juridica).Error; err != nil {
				tx.Rollback()
				log.Println("Error creating SAVe_Situacao_Juridica:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create situacao juridica: " + err.Error()})
				return
			}
		} else {
			// Use Save to ensure zero values (false, empty strings) are updated
			if err := tx.Save(&input.SAVe_Situacao_Juridica).Error; err != nil {
				tx.Rollback()
				log.Println("Error updating SAVe_Situacao_Juridica:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update situacao juridica: " + err.Error()})
				return
			}
		}

		// 2. Save SAVe_Situacao_Juridica2
		input.SituacaoJuridica2.ID_Caso = id // Ensure ID_Caso is set
		var count2 int64
		tx.Model(&models.SAVe_Situacao_Juridica2{}).Where("\"ID_Caso\" = ?", id).Count(&count2)
		if count2 == 0 {
			if err := tx.Create(&input.SituacaoJuridica2).Error; err != nil {
				tx.Rollback()
				log.Println("Error creating SAVe_Situacao_Juridica2:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create situacao juridica 2: " + err.Error()})
				return
			}
		} else {
			// Use Save to ensure zero values (false, empty strings) are updated
			if err := tx.Save(&input.SituacaoJuridica2).Error; err != nil {
				tx.Rollback()
				log.Println("Error updating SAVe_Situacao_Juridica2:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update situacao juridica 2: " + err.Error()})
				return
			}
		}

		// 3. Save Processos (Delete all and recreate)
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Situacao_Juridica_Incluir_processo{}).Error; err != nil {
			tx.Rollback()
			log.Println("Error deleting old Processos:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old processos: " + err.Error()})
			return
		}
		for _, proc := range input.Processos {
			proc.ID_Caso = id
			proc.ID = 0
			if err := tx.Create(&proc).Error; err != nil {
				tx.Rollback()
				log.Println("Error creating Processo:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create processo: " + err.Error()})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Situacao Juridica updated"})

	case "saude":
		var input struct {
			Saude models.SAVe_Saude `json:"saude"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		tx := database.DB.Begin()

		input.Saude.ID_Caso = id // Ensure ID_Caso is set

		var count int64
		tx.Model(&models.SAVe_Saude{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input.Saude).Error; err != nil {
				tx.Rollback()
				log.Println("Error creating SAVe_Saude:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create saude: " + err.Error()})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_Saude{}).Where("\"ID_Caso\" = ?", id).Updates(&input.Saude).Error; err != nil {
				tx.Rollback()
				log.Println("Error updating SAVe_Saude:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update saude: " + err.Error()})
				return
			}
		}

		tx.Commit()
		c.JSON(http.StatusOK, gin.H{"message": "Saude updated successfully"})

	case "vinculos":
		var input struct {
			Vinculos      models.SAVe_Vinculos         `json:"vinculos"`
			VinculosApoio []models.SAVe_Vinculos_Apoio `json:"vinculosApoio"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		tx := database.DB.Begin()

		// 1. Save SAVe_Vinculos
		input.Vinculos.ID_Caso = uint(id)
		var count int64
		tx.Model(&models.SAVe_Vinculos{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input.Vinculos).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vinculos"})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_Vinculos{}).Where("\"ID_Caso\" = ?", id).Updates(&input.Vinculos).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vinculos"})
				return
			}
		}

		// 2. Save SAVe_Vinculos_Apoio (Delete all and recreate)
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Vinculos_Apoio{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old vinculos apoio"})
			return
		}
		for _, item := range input.VinculosApoio {
			item.ID_Caso = uint(id)
			item.ID = 0 // Ensure new ID
			if err := tx.Create(&item).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vinculos apoio"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Vinculos updated successfully"})

	case "vitimizacao":

		// Actually, let's bind to a struct that matches frontend, then map to model.
		var frontendInput struct {
			Secundaria map[string]interface{} `json:"Secundaria"`
			Terciaria  map[string]interface{} `json:"Terciaria"`
		}

		if err := c.ShouldBindJSON(&frontendInput); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Map to flat model
		var modelInput models.SAVe_Vitimizacao
		modelInput.ID_Caso = id

		// Helper to safely get bool/string

		getString := func(m map[string]interface{}, key string) string {
			if v, ok := m[key]; ok {
				if s, ok := v.(string); ok {
					return s
				}
			}
			return ""
		}

		// Secundaria
		// Secundaria
		modelInput.VST_Dep_repet_reviti = getString(frontendInput.Secundaria, "VST_Dep_repet_reviti")
		modelInput.VST_Espec_Dep_repet_reviti = getString(frontendInput.Secundaria, "VST_Espec_Dep_repet_reviti")
		modelInput.VST_Falta_atend_esp = getString(frontendInput.Secundaria, "VST_Falta_atend_esp")
		modelInput.VST_Espec_Falta_atend_esp = getString(frontendInput.Secundaria, "VST_Espec_Falta_atend_esp")
		modelInput.VST_Falta_info = getString(frontendInput.Secundaria, "VST_Falta_info")
		modelInput.VST_Espec_Falta_info = getString(frontendInput.Secundaria, "VST_Espec_Falta_info")
		modelInput.VST_Demora_sist_just = getString(frontendInput.Secundaria, "VST_Demora_sist_just")
		modelInput.VST_Espec_Demora_sist_just = getString(frontendInput.Secundaria, "VST_Espec_Demora_sist_just")
		modelInput.VST_Expos_vitima = getString(frontendInput.Secundaria, "VST_Expos_vitima")
		modelInput.VST_Espec_Expos_vitima = getString(frontendInput.Secundaria, "VST_Espec_Expos_vitima")
		modelInput.VST_Neg_part_proc = getString(frontendInput.Secundaria, "VST_Neg_part_proc")
		modelInput.VST_Espec_Neg_part_proc = getString(frontendInput.Secundaria, "VST_Espec_Neg_part_proc")
		modelInput.VST_Neg_apres_prova = getString(frontendInput.Secundaria, "VST_Neg_apres_prova")
		modelInput.VST_Espec_Neg_apres_prova = getString(frontendInput.Secundaria, "VST_Espec_Neg_apres_prova")
		modelInput.VST_Neg_acesso_dir = getString(frontendInput.Secundaria, "VST_Neg_acesso_dir")
		modelInput.VST_Espec_Neg_acesso_dir = getString(frontendInput.Secundaria, "VST_Espec_Neg_acesso_dir")
		modelInput.VST_Desresp_sigilo = getString(frontendInput.Secundaria, "VST_Desresp_sigilo")
		modelInput.VST_Espec_Desresp_sigilo = getString(frontendInput.Secundaria, "VST_Espec_Desresp_sigilo")
		modelInput.VST_Desresp_nome_soc = getString(frontendInput.Secundaria, "VST_Desresp_nome_soc")
		modelInput.VST_Espec_Desresp_nome_soc = getString(frontendInput.Secundaria, "VST_Espec_Desresp_nome_soc")
		modelInput.VST_Outras_vit = getString(frontendInput.Secundaria, "VST_Outras_vit")
		modelInput.VST_Espec_Outras_vit = getString(frontendInput.Secundaria, "VST_Espec_Outras_vit")

		// Terciaria
		// Terciaria
		modelInput.VT_Culpa_vit = getString(frontendInput.Terciaria, "VT_Culpa_vit")
		modelInput.VT_Espec_Culpa_vit = getString(frontendInput.Terciaria, "VT_Espec_Culpa_vit")
		modelInput.VT_Estig_social = getString(frontendInput.Terciaria, "VT_Estig_social")
		modelInput.VT_Espec_Estig_social = getString(frontendInput.Terciaria, "VT_Espec_Estig_social")
		modelInput.VT_Falta_Poli_publicas = getString(frontendInput.Terciaria, "VT_Falta_Poli_publicas")
		modelInput.VT_Espec_Falta_Poli_publicas = getString(frontendInput.Terciaria, "VT_Espec_Falta_Poli_publicas")
		modelInput.VT_Explo_midiatica = getString(frontendInput.Terciaria, "VT_Explo_midiatica")
		modelInput.VT_Espec_Explo_midiatica = getString(frontendInput.Terciaria, "VT_Espec_Explo_midiatica")
		modelInput.VT_Outras_vit = getString(frontendInput.Terciaria, "VT_Outras_vit")
		modelInput.VT_Espec_Outras_vit = getString(frontendInput.Terciaria, "VT_Espec_Outras_vit")

		tx := database.DB.Begin()

		var count int64
		tx.Model(&models.SAVe_Vitimizacao{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&modelInput).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create vitimizacao"})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_Vitimizacao{}).Where("\"ID_Caso\" = ?", id).Updates(&modelInput).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vitimizacao"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Vitimizacao updated successfully"})

	case "protecao-seguranca":
		var input struct {
			ProtecaoSeguranca models.SAVe_protecao_seguranca               `json:"protecaoSeguranca"`
			Ameacadores       []models.SAVe_protecao_seguranca_ameacadores `json:"ameacadores"`
			Adolescentes      []models.SAVe_protecao_seguranca_adolescente `json:"adolescentes"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		tx := database.DB.Begin()

		// 1. Save SAVe_protecao_seguranca
		input.ProtecaoSeguranca.ID_Caso = id
		var count int64
		tx.Model(&models.SAVe_protecao_seguranca{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input.ProtecaoSeguranca).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create protecao seguranca"})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_protecao_seguranca{}).Where("\"ID_Caso\" = ?", id).Updates(&input.ProtecaoSeguranca).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update protecao seguranca"})
				return
			}
		}

		// 2. Save SAVe_protecao_seguranca_ameacadores (Delete all and recreate)
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_protecao_seguranca_ameacadores{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old ameacadores"})
			return
		}
		for _, item := range input.Ameacadores {
			item.ID_Caso = id
			item.ID = 0 // Ensure new ID
			if err := tx.Create(&item).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ameacador"})
				return
			}
		}

		// 3. Save SAVe_protecao_seguranca_adolescente (Delete all and recreate)
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_protecao_seguranca_adolescente{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old adolescentes"})
			return
		}
		for _, item := range input.Adolescentes {
			item.ID_Caso = id
			item.ID = 0 // Ensure new ID
			if err := tx.Create(&item).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create adolescente"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Protecao Seguranca updated successfully"})

	case "agressor":
		var input struct {
			Agressores []models.SAVe_Agressor `json:"agressores"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		tx := database.DB.Begin()

		// Delete all existing agressores for this case
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Agressor{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old agressores"})
			return
		}

		// Create new ones
		for _, agressor := range input.Agressores {
			agressor.ID_Caso = id
			agressor.ID = 0 // Ensure new ID
			if err := tx.Create(&agressor).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create agressor"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Agressor data saved successfully"})

	case "encerramento":
		var input models.SAVe_Encerramento
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		input.ID_Caso = id
		tx := database.DB.Begin()

		var count int64
		tx.Model(&models.SAVe_Encerramento{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create encerramento: " + err.Error()})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_Encerramento{}).Where("\"ID_Caso\" = ?", id).Updates(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update encerramento: " + err.Error()})
				return
			}
		}

		tx.Commit()
		c.JSON(http.StatusOK, gin.H{"message": "Encerramento updated successfully"})

	case "acompanhamentos":
		// Redirect to vinculos endpoint
		var input struct {
			Acompanhamentos []models.SAVe_Acompanhamentos `json:"acompanhamentos"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		tx := database.DB.Begin()

		// Delete all existing acompanhamentos for this case
		if err := tx.Where("\"ID_Caso\" = ?", id).Delete(&models.SAVe_Acompanhamentos{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old acompanhamentos"})
			return
		}

		// Create new ones
		for _, acomp := range input.Acompanhamentos {
			acomp.ID_Caso = id
			acomp.ID = 0 // Ensure new ID
			if err := tx.Create(&acomp).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create acompanhamento"})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Acompanhamentos updated successfully"})

	case "sintese-analitica":
		var input models.SAVe_SinteseAnalitica
		if err := c.ShouldBindJSON(&input); err != nil {
			fmt.Println("Error binding JSON for sintese-analitica:", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		input.ID_Caso = id
		tx := database.DB.Begin()

		var count int64
		tx.Model(&models.SAVe_SinteseAnalitica{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create sintese analitica: " + err.Error()})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_SinteseAnalitica{}).Where("\"ID_Caso\" = ?", id).Updates(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update sintese analitica: " + err.Error()})
				return
			}
		}

		tx.Commit()
		c.JSON(http.StatusOK, gin.H{"message": "Sintese Analitica updated successfully"})

	case "geral":
		var input struct {
			Tipo_Form string `json:"Tipo_Form"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		updates := map[string]interface{}{}
		if input.Tipo_Form != "" {
			updates["Tipo_Form"] = input.Tipo_Form
		}

		if len(updates) > 0 {
			tx := database.DB.Begin()
			if err := tx.Model(&models.SAVe_Geral{}).Where("\"ID_Caso\" = ?", id).Updates(updates).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update geral info: " + err.Error()})
				return
			}
			tx.Commit()
		}

		c.JSON(http.StatusOK, gin.H{"message": "Geral info updated successfully"})

	case "ensino-trab-renda":
		var input models.SAVe_Ensino_trab_renda
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		input.ID_Caso = uint(id)
		tx := database.DB.Begin()

		var count int64
		tx.Model(&models.SAVe_Ensino_trab_renda{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ensino trab renda: " + err.Error()})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_Ensino_trab_renda{}).Where("\"ID_Caso\" = ?", id).Updates(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update ensino trab renda: " + err.Error()})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Ensino Trab Renda updated successfully"})

	case "assistencia":
		var input models.SAVe_Assistencia
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		input.ID_Caso = uint(id)
		tx := database.DB.Begin()

		var count int64
		tx.Model(&models.SAVe_Assistencia{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create assistencia: " + err.Error()})
				return
			}
		} else {
			// Ensure we don't overwrite ID if it's 0 in input but exists in DB
			var existing models.SAVe_Assistencia
			tx.Where("\"ID_Caso\" = ?", id).First(&existing)
			input.ID = existing.ID

			if err := tx.Model(&models.SAVe_Assistencia{}).Where("\"ID_Caso\" = ?", id).Updates(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update assistencia: " + err.Error()})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Assistencia updated successfully"})

	case "habitacao-territorio":
		var input models.SAVe_Habitacao_territorio
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		input.ID_Caso = id
		tx := database.DB.Begin()

		var count int64
		tx.Model(&models.SAVe_Habitacao_territorio{}).Where("\"ID_Caso\" = ?", id).Count(&count)
		if count == 0 {
			if err := tx.Create(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create habitacao territorio: " + err.Error()})
				return
			}
		} else {
			if err := tx.Model(&models.SAVe_Habitacao_territorio{}).Where("\"ID_Caso\" = ?", id).Updates(&input).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update habitacao territorio: " + err.Error()})
				return
			}
		}

		if err := tx.Commit().Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Habitacao Territorio updated successfully"})

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid section"})
	}
}

func ReopenCase(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// TODO: Add admin permission check here
	// For now, allowing all authenticated users to reopen

	// Update Encerrado field in SAVe_Geral
	if err := database.DB.Model(&models.SAVe_Geral{}).
		Where("\"ID_Caso\" = ?", id).
		Update("\"Encerrado\"", "Não").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reopen case"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Case reopened successfully"})
}
