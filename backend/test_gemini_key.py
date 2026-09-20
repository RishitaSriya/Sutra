import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=key)

for model_name in ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest"]:
    print(f"\n--- Testing model: {model_name} ---")
    try:
        model = genai.GenerativeModel(model_name)
        res = model.generate_content("Say hello in one short sentence as a Senior Engineering Lead at ChaiPay!")
        print(f"[SUCCESS with {model_name}!]:\n", res.text.strip())
        break
    except Exception as e:
        print(f"Error with {model_name}:", e)
