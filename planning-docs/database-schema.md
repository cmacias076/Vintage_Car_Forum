# Database Schema – Vintage Car Forum

## 1. User
- _id: ObjectId
- username: String (unique, required)
- email: String (unique, required)
- passwordHash: String (hashed using bcrypt)
- createdAt: Date

## 2. Category
- _id: ObjectId
- name: String (e.g., "Muscle Cars", "Vintage Sports Cars")
- description: String (optional)

## 3. Question
- _id: ObjectId
- categoryId: ObjectId (refers to Category)
- authorId: ObjectId (refers to User)
- content: String (must end in "?")
- createdAt: Date

## 4. Answer
- _id: ObjectId
- questionId: ObjectId (refers to Question)
- authorId: ObjectId (refers to User)
- content: String (not empty)
- createdAt: Date
