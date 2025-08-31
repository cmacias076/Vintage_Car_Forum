# API Endpoints – Vintage Car Forum

## Authentication
- POST `/api/register` → Create user
- POST `/api/login` → Authenticate and return JWT token

## Categories
- GET `/api/categories` → Return list of all categories

## Questions
- GET `/api/categories/:categoryId/questions` → Return all questions for that category
- GET `/api/questions/:questionId` → Get question details with answers
- POST `/api/questions` → Submit new question (protected)

## Answers
- POST `/api/questions/:questionId/answers` → Submit new answer (protected)

## Middleware
- `verifyToken` → JWT middleware for protecting routes
