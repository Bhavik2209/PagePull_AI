import google.generativeai as genai
import os
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

def extract_content(dom_content,parse_description):

    # Initialize Groq client
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

    prompt_template = """
    You are tasked with extracting specific information from the following text content: {dom_chunk}.
    Please follow these instructions carefully:

    1. **Extract Information:** Only extract the information that directly matches the provided description: {parse_description}.
    2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response.
    3. **Empty Response:** If no information matches the description, return an empty string ('').
    4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text.
    """

    parsed_results = []
    for i, dom_chunk in enumerate(dom_content):
        try:
            # Format the prompt with the specific chunk
            prompt = prompt_template.format(dom_chunk=dom_chunk, parse_description=parse_description)

            # Generate content using Groq API
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",  # Replace with your desired model
            )

            # Extract and append the content from the response
            parsed_results.append(response.choices[0].message.content.strip())
        except Exception as e:
            print(f"Error generating content for chunk {i}: {e}")
            parsed_results.append("")  # Gracefully handle errors

    return '\n'.join(parsed_results)
