from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot import Chatbot
from quiz_generator import QuizGenerator

app = FastAPI(title="AI Study Buddy API")

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
chatbot = Chatbot()
quiz_generator = QuizGenerator()

# ------------------ Models ------------------
class ChatRequest(BaseModel):
    question: str

class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "medium"

# ------------------ Routes ------------------
@app.post("/chat")
def chat(req: ChatRequest):
    reply = chatbot.get_response(req.question)
    return {"response": reply}

@app.post("/generate-quiz")
def generate_quiz(req: QuizRequest):
    quiz = quiz_generator.generate_quiz(
        topic=req.topic,
        difficulty=req.difficulty
    )
    return {"quiz": quiz}

@app.get("/")
def root():
    return {"message": "AI Study Buddy Backend is running"}
