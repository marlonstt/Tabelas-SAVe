package main

import (
	"encoding/csv"
	"log"
	"os"
	"reflect"
	"strconv"
	"strings"
	"time"

	"save-backend/internal/database"
	"save-backend/internal/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func main() {
	// Initialize Database
	// This will use settings from .env or defaults (localhost, 5432, postgres, 86076448, save_db)
	database.Connect()
	if !database.Connected {
		log.Fatal("Could not connect to database. Aborting migration.")
	}

	// Path to CSV files
	// Assuming running from 'backend' directory
	csvBasePath := "Todas listas SAVe"

	// Migrate Tables
	migrateTable(database.DB, csvBasePath+"/SAVe_Geral.csv", &models.SAVe_Geral{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Identificacao.csv", &models.SAVe_Identificacao{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Identificacao_telefone.csv", &models.SAVe_Identificacao_telefone{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Identificacao_email.csv", &models.SAVe_Identificacao_email{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Identificacao_endereco.csv", &models.SAVe_Identificacao_endereco{})
	migrateTable(database.DB, csvBasePath+"/SAVe_DadosDeEntrada.csv", &models.SAVe_DadosDeEntrada{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Encerramento.csv", &models.SAVe_Encerramento{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Casos_Vinculados.csv", &models.SAVe_Casos_Vinculados{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Situacao_Juridica.csv", &models.SAVe_Situacao_Juridica{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Situacao_Juridica2.csv", &models.SAVe_Situacao_Juridica2{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Situacao_Juridica_Incluir_processo.csv", &models.SAVe_Situacao_Juridica_Incluir_processo{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Saude.csv", &models.SAVe_Saude{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Habitacao_territorio.csv", &models.SAVe_Habitacao_territorio{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Assistencia.csv", &models.SAVe_Assistencia{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Ensino-trab-renda.csv", &models.SAVe_Ensino_trab_renda{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Vinculos.csv", &models.SAVe_Vinculos{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Vinculos_Apoio.csv", &models.SAVe_Vinculos_Apoio{})
	migrateTable(database.DB, csvBasePath+"/SAVe_protecao_seguranca.csv", &models.SAVe_protecao_seguranca{})
	migrateTable(database.DB, csvBasePath+"/SAVe_protecao_seguranca_ameacadores.csv", &models.SAVe_protecao_seguranca_ameacadores{})
	migrateTable(database.DB, csvBasePath+"/SAVe_protecao_seguranca_adolescente.csv", &models.SAVe_protecao_seguranca_adolescente{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Acompanhamentos.csv", &models.SAVe_Acompanhamentos{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Vitimizacao.csv", &models.SAVe_Vitimizacao{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Perfil_Agressor.csv", &models.SAVe_Perfil_Agressor{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Perfil_Agressor_Endereco.csv", &models.SAVe_Perfil_Agressor_Endereco{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Sintese_Analitica.csv", &models.SAVe_Sintese_Analitica{})
	migrateTable(database.DB, csvBasePath+"/SAVe_Usuarios.csv", &models.SAVe_Usuarios{})
}

func migrateTable(db *gorm.DB, filePath string, model interface{}) {
	log.Printf("Migrating %s...", filePath)

	file, err := os.Open(filePath)
	if err != nil {
		log.Printf("Error opening file %s: %v", filePath, err)
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.LazyQuotes = true
	headers, err := reader.Read()
	if err != nil {
		log.Printf("Error reading headers from %s: %v", filePath, err)
		return
	}

	// Handle BOM in first header
	if len(headers) > 0 {
		headers[0] = strings.TrimPrefix(headers[0], "\ufeff")
	}

	records, err := reader.ReadAll()
	if err != nil {
		log.Printf("Error reading records from %s: %v", filePath, err)
		return
	}

	// Get type of model
	modelType := reflect.TypeOf(model).Elem()

	tx := db.Begin()
	count := 0

	for _, record := range records {
		newStruct := reflect.New(modelType).Elem()

		for i, header := range headers {
			if i >= len(record) {
				continue
			}
			value := record[i]

			// Find field by gorm tag or name
			field := findFieldByColumnName(modelType, header)
			if field != nil {
				// Apply transformations based on field name and model
				if field.Name == "Tipo_Form" && modelType.Name() == "SAVe_Geral" {
					lowerVal := strings.ToLower(value)
					if lowerVal == "true" || lowerVal == "completo" || lowerVal == "versão completa" || lowerVal == "versao completa" {
						value = "Versão Completa"
					} else if lowerVal == "false" || lowerVal == "breve" || lowerVal == "versão breve" || lowerVal == "versao breve" {
						value = "Versão Breve"
					}
				}

				if field.Name == "Encerrado" && modelType.Name() == "SAVe_Geral" {
					if strings.ToLower(value) == "true" {
						value = "Sim"
					} else if strings.ToLower(value) == "false" {
						value = "Não"
					}
				}

				// Apply date cleaning for specific fields
				if isDateField(modelType.Name(), field.Name) {
					value = cleanDate(value)
				}

				setFieldValue(newStruct.FieldByIndex(field.Index), value)
			} else {
				// Handle mismatched columns manually
				if modelType.Name() == "SAVe_Acompanhamentos" && header == "Tipo_Atend" {
					// Find Tipo_Atendimento field
					f, _ := modelType.FieldByName("Tipo_Atendimento")
					setFieldValue(newStruct.FieldByIndex(f.Index), value)
				}
				if modelType.Name() == "SAVe_Identificacao_email" && (strings.EqualFold(header, "E-mail") || strings.EqualFold(header, "Email")) {
					f, _ := modelType.FieldByName("Email")
					setFieldValue(newStruct.FieldByIndex(f.Index), value)
				}
			}
		}

		// Custom logic to prevent duplicates for Phones and Emails
		if modelType.Name() == "SAVe_Identificacao_telefone" {
			var existing models.SAVe_Identificacao_telefone
			idCasoField := newStruct.FieldByName("ID_Caso")
			telefoneField := newStruct.FieldByName("TelefoneDDD")

			// Only check if ID_Caso is valid (not 0)
			if idCasoField.Int() != 0 {
				// Naive check: if ID_Caso + Phone matches, update
				if err := tx.Where("\"ID_Caso\" = ? AND \"TelefoneDDD\" = ?", idCasoField.Int(), telefoneField.String()).First(&existing).Error; err == nil {
					newStruct.FieldByName("ID").SetInt(int64(existing.ID))
				}
			}
		} else if modelType.Name() == "SAVe_Identificacao_email" {
			var existing models.SAVe_Identificacao_email
			idCasoField := newStruct.FieldByName("ID_Caso")
			emailField := newStruct.FieldByName("Email")

			if idCasoField.Int() != 0 {
				if err := tx.Where("\"ID_Caso\" = ? AND \"Email\" = ?", idCasoField.Int(), emailField.String()).First(&existing).Error; err == nil {
					newStruct.FieldByName("ID").SetInt(int64(existing.ID))
				}
			}
		} else if modelType.Name() == "SAVe_Identificacao_endereco" {
			var existing models.SAVe_Identificacao_endereco
			idCasoField := newStruct.FieldByName("ID_Caso")
			enderecoField := newStruct.FieldByName("Endereco")
			numeroField := newStruct.FieldByName("Numero")

			if idCasoField.Int() != 0 {
				if err := tx.Where("\"ID_Caso\" = ? AND \"Endereco\" = ? AND \"Numero\" = ?", idCasoField.Int(), enderecoField.String(), numeroField.String()).First(&existing).Error; err == nil {
					newStruct.FieldByName("ID").SetInt(int64(existing.ID))
				}
			}
		} else if modelType.Name() == "SAVe_Usuarios" {
			var existing models.SAVe_Usuarios
			emailField := newStruct.FieldByName("Email")

			if emailField.String() != "" {
				if err := tx.Where("email = ?", emailField.String()).First(&existing).Error; err == nil {
					newStruct.FieldByName("ID").SetInt(int64(existing.ID))
				}
			}
		} else if modelType.Name() == "SAVe_Perfil_Agressor" {
			var existing models.SAVe_Perfil_Agressor
			idCasoField := newStruct.FieldByName("ID_Caso")
			nomeCivilField := newStruct.FieldByName("PA_Nome_Civil")
			razaoSocialField := newStruct.FieldByName("PA_Razao_Social")

			if idCasoField.Int() != 0 {
				query := tx.Where("\"ID_Caso\" = ?", idCasoField.Int())
				if nomeCivilField.String() != "" {
					query = query.Where("\"PA_Nome_Civil\" = ?", nomeCivilField.String())
				} else if razaoSocialField.String() != "" {
					query = query.Where("\"PA_Razao_Social\" = ?", razaoSocialField.String())
				}

				if nomeCivilField.String() != "" || razaoSocialField.String() != "" {
					if err := query.First(&existing).Error; err == nil {
						newStruct.FieldByName("ID").SetInt(int64(existing.ID))
					}
				}
			}
		}

		if err := tx.Clauses(clause.OnConflict{UpdateAll: true}).Create(newStruct.Addr().Interface()).Error; err != nil {
			log.Printf("Error inserting record in %s: %v", filePath, err)
			// Continue despite errors? Usually better to fail or log.
			// tx.Rollback() // Don't rollback entire transaction for one error if we want partial success?
			// But for consistent migration, maybe rollback.
			// The original script rolls back.
			tx.Rollback()
			return
		}
		count++
	}

	tx.Commit()
	log.Printf("Successfully migrated %d records from %s", count, filePath)
}

func isDateField(modelName, fieldName string) bool {
	// List of fields that are dates stored as strings
	if modelName == "SAVe_Geral" && fieldName == "Data" {
		return true
	}
	if modelName == "SAVe_DadosDeEntrada" && fieldName == "Data" {
		return true
	}
	if modelName == "SAVe_Identificacao" && fieldName == "Data_nascimento" {
		return true
	}
	if modelName == "SAVe_Encerramento" && fieldName == "Data" {
		return true
	}
	if modelName == "SAVe_Acompanhamentos" && fieldName == "Data" {
		return true
	}
	if modelName == "SAVe_Perfil_Agressor" && fieldName == "PA_Data_Nascimento" {
		return true
	}
	if modelName == "SAVe_Sintese_Analitica" && fieldName == "DataVencimento" {
		return true
	}
	return false
}

func cleanDate(value string) string {
	if value == "" {
		return ""
	}

	// Try parsing with various layouts
	layouts := []string{
		"02/01/2006",
		"02/01/2006 15:04",
		"02/01/2006 15:04:05",
		"2006-01-02",
		"2006-01-02 15:04:05",
		"2006-01-02T15:04:05Z",
	}

	for _, layout := range layouts {
		t, err := time.Parse(layout, value)
		if err == nil {
			return t.Format("2006-01-02")
		}
	}

	// If parsing fails, return original value (might be empty or invalid)
	return value
}

func parseTime(value string) *time.Time {
	if value == "" {
		return nil
	}

	layouts := []string{
		"02/01/2006",
		"02/01/2006 15:04",
		"02/01/2006 15:04:05",
		"2006-01-02",
		"2006-01-02 15:04:05",
		"2006-01-02T15:04:05Z",
		time.RFC3339,
	}

	for _, layout := range layouts {
		t, err := time.Parse(layout, value)
		if err == nil {
			return &t
		}
	}
	return nil
}

func findFieldByColumnName(t reflect.Type, colName string) *reflect.StructField {
	// Trim quotes from column name
	colName = strings.Trim(colName, "\"")

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		tag := field.Tag.Get("gorm")

		// Extract column name from tag (e.g., column:"ID_Caso")
		if strings.Contains(tag, "column:") {
			parts := strings.Split(tag, ";")
			for _, part := range parts {
				if strings.HasPrefix(part, "column:") {
					tagCol := strings.TrimPrefix(part, "column:")
					tagCol = strings.Trim(tagCol, "\"") // Remove quotes
					if strings.EqualFold(tagCol, colName) {
						return &field
					}
				}
			}
		}

		// Fallback to field name match
		if strings.EqualFold(field.Name, colName) {
			return &field
		}
	}
	return nil
}

func setFieldValue(field reflect.Value, value string) {
	if !field.CanSet() {
		return
	}

	switch field.Kind() {
	case reflect.String:
		field.SetString(value)
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		if value == "" {
			field.SetInt(0)
		} else {
			val, err := strconv.ParseInt(value, 10, 64)
			if err == nil {
				field.SetInt(val)
			}
		}
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		if value == "" {
			field.SetUint(0)
		} else {
			val, err := strconv.ParseUint(value, 10, 64)
			if err == nil {
				field.SetUint(val)
			}
		}
	case reflect.Float32, reflect.Float64:
		if value == "" {
			field.SetFloat(0)
		} else {
			val, err := strconv.ParseFloat(strings.Replace(value, ",", ".", -1), 64)
			if err == nil {
				field.SetFloat(val)
			}
		}
	case reflect.Bool:
		val := false
		lower := strings.ToLower(value)
		if lower == "true" || lower == "1" || lower == "sim" || lower == "s" {
			val = true
		}
		field.SetBool(val)
	case reflect.Ptr:
		if field.Type() == reflect.TypeOf((*time.Time)(nil)) {
			t := parseTime(value)
			if t != nil {
				field.Set(reflect.ValueOf(t))
			}
		}
	}
}
