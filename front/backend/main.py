from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Модель даних
class DataInput(BaseModel):
    text: str
from fastapi.middleware.cors import CORSMiddleware

# Додайте цей код після ініціалізації FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Дозволити всі домени (для тестування). У продакшені використовуйте список дозволених доменів.
    allow_credentials=True,
    allow_methods=["*"],  # Дозволити всі HTTP-методи
    allow_headers=["*"],  # Дозволити всі заголовки
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI and React!"}

@app.post("/process/")
def process_data(data: DataInput):
    processed_text = data
    #####################################
    word_count = len(data.text.split())
    char_count = len(data.text)
    print(f"Original Text: {data.text}")
    print(f"Word Count: {word_count}")
    print(f"Character Count: {char_count}")
    ################################
    return  processed_text
