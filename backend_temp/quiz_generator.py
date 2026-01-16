import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class QuizGenerator:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def generate_quiz(self, topic: str, difficulty: str = "medium", n_questions: int = 10):
        prompt = f"""
        You are a professional quiz generator.

        Generate {n_questions} multiple-choice questions on "{topic}".
        Difficulty level: {difficulty}

        Respond ONLY with a valid JSON array in this format:
        [
          {{
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Correct option"
          }}
        ]
        """

        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()

            # Extract JSON safely
            match = re.search(r'\[.*\]', text, re.DOTALL)
            if not match:
                raise ValueError("Invalid JSON returned")

            quiz = json.loads(match.group(0))
            return quiz

        except Exception as e:
            print("Quiz generation error:", e)

            # Fallback quiz
            return [
                {
                    "question": f"Sample question on {topic}",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "Option A"
                }
            ]
