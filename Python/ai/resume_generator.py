from openai import OpenAI
from ai.prompts import build_resume_prompt
import os
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_ai_resume(user_data):
    prompt = build_resume_prompt(user_data)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    content = response.choices[0].message.content.strip()

    # 🔥 REMOVE MARKDOWN CODE BLOCKS IF PRESENT
    if content.startswith("```"):
        content = content.replace("```json", "").replace("```", "").strip()

    # Optional: log cleaned output
    print("CLEANED AI OUTPUT:\n", content)

    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        print("JSON PARSE ERROR:", e)
        print("RAW CONTENT WAS:\n", content)
        raise Exception("AI did not return valid JSON")