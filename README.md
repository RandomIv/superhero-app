
# 🦸‍♂️ Superhero Management App

A full-stack application for managing a database of superheroes. The project features a modern architecture, robust validation, containerization, and a comprehensive testing suite.

## 🛠 Tech Stack

**Backend:**
- **NestJS** (Modular Architecture)
- **Prisma ORM** (PostgreSQL interaction)
- **Jest** (Unit Testing)

**Frontend:**
- **Next.js 15** (App Router)
- **React Query** (Server state management)
- **Tailwind CSS + Shadcn/UI** (Styling)
- **React Hook Form + Zod** (Validation)

**DevOps & Tools:**
- **Docker & Docker Compose** (Containerization)
- **GitHub Actions** (CI/CD Pipeline)
- **ESLint / Prettier** (Code quality)
- **Jest** (Unit Testing)

---

## 🚀 Getting Started

You can run the project in two ways: using **Docker** (recommended) or **Manually**.

### 🐳 Option 1: Docker (Recommended)
*Fastest way to see the app in action. No Node.js or Postgres required locally.*

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RandomIv/superhero-app.git
   cd superhero-app

```
2. **Setup Environment:**
Create a `.env` file in the root directory from the example:
```bash
cp .env.example .env

```

3. **Run the application:**
```bash
docker-compose up --build

```


4. **Access the App:**
* **Frontend:** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* **Backend API:** [http://localhost:5000](https://www.google.com/search?q=http://localhost:5000)



*Note: Database migrations are applied automatically on container startup.*

---

### 🛠️ Option 2: Manual Setup (Local Development)

Use this if you want to run the app locally (e.g., for debugging) but don't want to install PostgreSQL manually.

#### 1. Database
 **Setup Environment:**
Create a `.env` file in the root directory from the example:
```bash
cp .env.example .env
```
You don't need to install PostgreSQL system-wide. Just spin up the database container from this project:

```bash
# Starts only the database in the background
docker-compose up -d db

```

*The database is now running on `localhost:5432`.*

#### 2. Backend (API)

Navigate to the `api` folder:

```bash
cd api
npm install

```

Setup environment:

```bash
cp .env.example .env
# The default .env.example connects to localhost:5432

```

Generate Prisma Client & Run Migrations:

```bash
npx prisma generate
npx prisma migrate dev

```

Start server:

```bash
npm run start:dev

```

#### 3. Frontend (Web)

Open a new terminal and navigate to the `web` folder:

```bash
cd web
npm install

```

Setup environment:

```bash
cp .env.example .env

```

Start the frontend:

```bash
npm run dev

```

---

## 🧪 Running Tests

### Option 1: Inside Docker (Easiest)

You can run tests directly inside the containers without installing dependencies locally.

```bash
# Backend Tests
docker exec -it superhero_api npm test

# Frontend Tests
docker exec -it superhero_web npm test

```

### Option 2: Local Environment

```bash
cd api && npm test
cd web && npm test

```

---

## 📂 Project Highlights

### ✅ Architecture & Quality
* **CI Pipeline:** GitHub Actions workflow ensures that Linting and Tests pass on every Push/PR.
* **Validation:** Shared validation logic ensures data integrity from the UI form down to the Database.

### 🖼 Features

* **CRUD Operations:** Full lifecycle management of superheroes.
* **Pagination:** Server-side pagination for optimal performance.
* **Media:** Image upload support (stored locally in `/api/images`).
* **Responsive Design:** Mobile-friendly UI built with Tailwind CSS.

