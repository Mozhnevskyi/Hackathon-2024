from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing; restrict in production.
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Input data model
class DataInput(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI and React!"}

@app.post("/process/")
def process_data(data: DataInput):
    # Check for empty input
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty.")

    # Process text
    normalized_text = " ".join(data.text.split())  # Remove extra spaces

    print(f"Original Text: {data.text}")
    print(f"Normalized Text: {normalized_text}")

    # Return processed data
    return {
        "original_text": data.text,
        "normalized_text": normalized_text,
    }
