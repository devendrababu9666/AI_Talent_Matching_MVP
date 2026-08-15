import json
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
load_dotenv()  

class LLMService:

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0,
        )

    def invoke(self, prompt: str) -> str:
        response = self.llm.invoke(prompt)
        return response.content

    def generate_json(self, prompt: str) -> dict:
        response = self.llm.invoke(prompt)

        content = str(response.content)

        # Clean markdown code fences if Gemini returns them
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()
        
        return json.loads(content)


model = LLMService()