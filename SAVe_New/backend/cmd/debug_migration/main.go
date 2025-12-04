package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"reflect"
	"save-backend/internal/database"
	"save-backend/internal/models"
	"strconv"
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func main() {
	// Initialize Database
	database.Connect()
	if !database.Connected {
		log.Fatal("Could not connect to database.")
	}

	f, err := os.Create("debug_output_utf8.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	// Path to CSV files
	csvBasePath := "Todas listas SAVe"
	filePath := csvBasePath + "/SAVe_Ensino-trab-renda.csv"

	migrateTable(f, database.DB, filePath, &models.SAVe_Ensino_trab_renda{})
}

func migrateTable(w io.Writer, db *gorm.DB, filePath string, model interface{}) {
	fmt.Fprintf(w, "Migrating %s...\n", filePath)

	file, err := os.Open(filePath)
	if err != nil {
		fmt.Fprintf(w, "Error opening file %s: %v\n", filePath, err)
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.LazyQuotes = true
	headers, err := reader.Read()
	if err != nil {
		fmt.Fprintf(w, "Error reading headers from %s: %v\n", filePath, err)
		return
	}

	// Handle BOM in first header
	if len(headers) > 0 {
		headers[0] = strings.TrimPrefix(headers[0], "\ufeff")
		fmt.Fprintf(w, "First header: %q\n", headers[0])
	}

	records, err := reader.ReadAll()
	if err != nil {
		fmt.Fprintf(w, "Error reading records from %s: %v\n", filePath, err)
		return
	}

	fmt.Fprintf(w, "Found %d records in CSV\n", len(records))

	// Get type of model
	modelType := reflect.TypeOf(model).Elem()

	tx := db.Begin()
	count := 0

	for i, record := range records {
		newStruct := reflect.New(modelType).Elem()

		for j, header := range headers {
			if j >= len(record) {
				continue
			}
			value := record[j]

			// Find field by gorm tag or name
			field := findFieldByColumnName(modelType, header)
			if field != nil {
				setFieldValue(newStruct.FieldByIndex(field.Index), value)
			}
		}

		// Print first record to see what's happening
		if i == 0 {
			fmt.Fprintf(w, "First record struct: %+v\n", newStruct.Interface())
		}

		if err := tx.Clauses(clause.OnConflict{UpdateAll: true}).Create(newStruct.Addr().Interface()).Error; err != nil {
			fmt.Fprintf(w, "Error inserting record %d in %s: %v\n", i, filePath, err)
			tx.Rollback()
			return
		}
		count++
	}

	tx.Commit()
	fmt.Fprintf(w, "Successfully migrated %d records from %s\n", count, filePath)
}

func findFieldByColumnName(t reflect.Type, colName string) *reflect.StructField {
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		tag := field.Tag.Get("gorm")

		if strings.Contains(tag, "column:") {
			parts := strings.Split(tag, ";")
			for _, part := range parts {
				if strings.HasPrefix(part, "column:") {
					tagCol := strings.TrimPrefix(part, "column:")
					tagCol = strings.Trim(tagCol, "\"")
					if strings.EqualFold(tagCol, colName) {
						return &field
					}
				}
			}
		}

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
	}
}
