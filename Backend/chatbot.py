import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class Chatbot:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def get_response(self, question: str) -> str:
        prompt = f"""
        You are an AI Study Buddy.
        Answer the question clearly and concisely.

        Question: {question}
        Answer:
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print("Chatbot error:", e)
            return "Sorry, I couldn't generate a response right now."
