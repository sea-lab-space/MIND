import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()

response = client.responses.create(
    model="gpt-4.1-nano",
    input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)
