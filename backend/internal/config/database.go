package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB() (*gorm.DB, error) {

	godotenv.Load()

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		logrus.Errorf("Failed to open database: %v", err)
		return nil, err
	}

	_, err = db.DB()
	if err != nil {
		logrus.Errorf("Failed to connect database: %v", err)
		return nil, err
	}

	// sqlDB.SetMaxOpenConns(os.Getenv("DB_MAX_OPEN_CONNECTION"))
	// sqlDB.SetMaxIdleConns(config.Database.MaxIdleConnection)
	// sqlDB.SetConnMaxLifetime(time.Duration(config.Database.MaxLifeTimeConnection) * time.Second)
	// sqlDB.SetConnMaxIdleTime(time.Duration(config.Database.MaxIdleTime) * time.Second)

	return db, nil
}
