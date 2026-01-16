---
title: AI Study Buddy
emoji: 🤖
colorFrom: green
colorTo: blue
sdk: docker
sdk_version: "0.0.1"
app_file: Dockerfile
pinned: false
---

# 🤖 AI Study Buddy (Hugging Face Spaces)

This is a mini virtual tutor that:

- Acts as a chatbot (`/chat`)
- Generates quizzes (`/generate-quiz`)

## 🚀 Endpoints

- `GET /` → health check
- `POST /chat` → `{ "question": "What is photosynthesis?" }`
- `POST /generate-quiz` → `{ "topic": "Physics", "difficulty": "easy" }`

## 📦 Run Locally

```bash
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
