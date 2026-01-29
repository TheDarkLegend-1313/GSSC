from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()

# ✅ OpenRouter client
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

SYSTEM_PROMPT = """
You are an expert Solar Energy Consultant.

Rules:
- Answer only solar-related questions (PV systems, inverters, batteries, pricing, ROI).
- Keep answers concise, practical, and technically accurate.
- Use simple language for non-technical users.
- If the question is unrelated to solar energy, politely refuse.
- Never hallucinate prices or government policies.
- If unsure, say you are unsure.
"""

def get_ai_response(user_message: str) -> str:
    """
    Sends user message to OpenRouter and returns AI response text.
    """

    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",  # ✅ OpenRouter-compatible model name
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.4,
            max_tokens=300,
            extra_headers={
                "HTTP-Referer": "http://localhost:3000",  # or your domain
                "X-Title": "GSSC Solar Assistant",
            },
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        # 🔥 NEVER crash Django because of AI
        print("🔥 OpenRouter Error:", str(e))
        return (
            "I'm temporarily unable to answer due to system limits. "
            "Please try again later."
        )
