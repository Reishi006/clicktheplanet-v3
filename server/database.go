package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

type Database interface {
	CreateAccount(*User) error
	GetAccountByLogin(string) (*User, error)
}

type Postgres struct {
	db *sql.DB
}

func NewDatabase() (*Postgres, error) {
	conn := "user=postgres dbname=clicktheplanet-v3 password=admin sslmode=disable"
	db, err := sql.Open("postgres", conn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &Postgres{
		db: db,
	}, nil
}

// Function for /register route
// Inserts into every table for game initialization
func (p *Postgres) CreateAccount(u *User) error {
	query := `INSERT INTO users (login, email, password, created_at) VALUES ($1, $2, $3, $4)`

	res, err := p.db.Query(query, u.Login, u.Email, u.Password, u.CreatedAt)

	if err != nil {
		return err
	}

	fmt.Printf("%+v", res)

	return nil
}

func (p *Postgres) GetAccountByLogin(login string) (*User, error) {
	query := `SELECT * FROM users WHERE login = $1`

	rows, err := p.db.Query(query, login)
	if err != nil {
		return nil, err
	}

	var user *User
	for rows.Next() {
		user = new(User)
		err = rows.Scan(
			&user.Id,
			&user.Login,
			&user.Email,
			&user.Password,
			&user.CreatedAt,
		)
	}
	fmt.Println(user)
	return user, err
}
