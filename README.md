# Book Library management

This project is create by Group 4 - Chuyen De
testing: https://cosmic-sundae-0b3700.netlify.app/
using accoutn and password test in Database/account.csv

## 1. Local implements

Requirements:

- NodeJS v16.13.0.
- Mysql 8.0.23

### Config env:

- add file `Backend/.env`:
  ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_pass
   DB_NAME=library
   DB_PORT=3306
   GMAIL= "yourgmail@gmail.com"
   GMAIL_PASS= "your_app_pass"
   CLOUDINARY_NAME= your**
   CLOUDINARY_KEY= yourkey**
   CLOUDINARY_SECRET= yourkeysecret**
  ```
- exec dump_sql file in db/library_db.sql

### Server:

Config your database in server/db.config.js
Run server:

#### `cd Backend`

#### `npm install`

#### `npm start`

### Client:

Run command:

#### `cd Frontend`

#### `npm install`

#### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 2. Docker:

- add .env file:
  ```
  MYSQLDB_USER=root
  MYSQLDB_ROOT_PASSWORD=****
  MYSQLDB_DATABASE=library
  MYSQLDB_LOCAL_PORT=3307
  MYSQLDB_DOCKER_PORT=3306

  NODE_LOCAL_PORT=6868
  NODE_DOCKER_PORT=8080

  CLIENT_ORIGIN=http://127.0.0.1:8888
  CLIENT_API_BASE_URL=http://127.0.0.1:6868

  REACT_LOCAL_PORT=8888
  REACT_DOCKER_PORT=80

  GMAIL= ****
  GMAIL_PASS=****

  CLOUDINARY_NAME=****
  CLOUDINARY_KEY=****
  CLOUDINARY_SECRET=****
  ```
- to run in background: `docker-conpose up -d`
- if any errors in groupby, please turn off full_group_by mode: `SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`
- command restore: `source /tmp/test/library_db.sql;`
