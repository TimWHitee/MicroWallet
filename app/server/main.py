from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys,os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from app.server.scripts import create_wallet

app = FastAPI()

# Настройка CORS
origins = [
    "http://localhost:3000",  # Укажите адрес вашего React приложения
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WalletResponse(BaseModel):
    mnemonic: list
    private_key: str
    public_key: str
    address: str
    seed: str
    entropy: str

@app.post("/create_wallet/", response_model=WalletResponse)
async def create_wallet_endpoint(words_in_mnemo: int = 24):
    try:
        wallet_data = create_wallet(words_in_mnemo)
        return wallet_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api", response_model=str)
async def start():
    return 'Alive!'


# if __name__ == "__main__":
#     print(create_wallet())
# uvicorn app.server.main:app --reload