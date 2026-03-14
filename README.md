# Menu Tree Project

This project consists of a backend API written in Go and a frontend UI built with Next.js for managing a hierarchical menu structure.

## Setup Instructions

### Prerequisites

- Go 1.25+
- Node.js 20+
- PostgreSQL
- Npm or Yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up environment variables. Create a `.env` file in the `backend` folder (you can use `.env.example` if it exists) with the necessary database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=menutree
   DB_PORT=5432
   PORT=8080
   ```
3. Install dependencies:
   ```bash
   go mod download
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd menu-tree-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

## How to run in development mode

### Backend (Development)

Inside the `backend` directory, run:

```bash
go run main.go serve
```

The server will start on the port specified in your `.env` file (e.g., 8080).

### Frontend (Development)

Inside the `menu-tree-ui` directory, run:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## How to run in production mode

### Backend (Production)

Build the Go binary and run it:

```bash
cd backend
go build -o server main.go
./server serve
```

### Frontend (Production)

Build the Next.js app and start the production server:

```bash
cd menu-tree-ui
npm run build
npm run start
# or
yarn build
yarn start
```

## API Documentation

The API is documented using Swagger. Once the backend is running, you can access the Swagger UI by visiting:

- **Swagger UI:** `http://localhost:8080/swagger/index.html` (Assuming you are using gin-swagger)
  Alternatively, you can examine the raw OpenAPI specification at:
- `backend/docs/swagger.json`
- `backend/docs/swagger.yaml`

## Technology Choices and Architecture Decisions

### Backend

- **Language/Framework:** Go 1.25 with the **Gin** web framework. Go was chosen for its performance, concurrency handling, and simplicity. Gin provides a fast and minimalist routing engine.
- **Database ORM:** GORM is used to interact with PostgreSQL, making it easier to define models and handle complex relationships like hierarchical trees.
- **Architecture:** The backend follows a layered architecture (Controllers, Services, Repositories) which separates the request handling, business logic, and data access layers. This making it highly maintainable and testable.
- **Documentation:** `swaggo/swag` is used to generate declarative API documentation directly from Go code comments.

### Frontend

- **Framework:** **Next.js** (App Router architecture). Next.js provides excellent performance, built-in optimization, and server-side rendering capabilities.
- **State Management:** **Zustand** is used for global state management. It provides a lightweight and unopinionated way to manage application state without the boilerplate of Redux.
- **Styling:** **Tailwind CSS** for fast, utility-first styling to build modern responsive interfaces efficiently.
- **HTTP Client:** **Axios** is used for making predictable and easily configurable HTTP requests to the backend API.
