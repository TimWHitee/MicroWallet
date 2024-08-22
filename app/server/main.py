from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import List
import sys,os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from auxiliary import EthClient
from scripts import create_wallet, SImportWallet, import_wallet
import json

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

TOKENS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'utils', 'tokens.json')


class WalletResponse(BaseModel):
    mnemonic: List[str]
    private_key: str
    public_key: str
    address: str
    seed: str
    entropy: str

class BalanceResponse(BaseModel):
    balance_usd: float
    tokens: dict

class ImportWalletResponse(BaseModel):
    address : str
    private_key: str
    transactions : List[str]

class Token(BaseModel):
    name: str
    address: str

@app.post("/create_wallet/", response_model=WalletResponse)
async def create_wallet_endpoint(words_in_mnemo: int = 24):
    try:
        wallet_data = create_wallet(words_in_mnemo)
        return wallet_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.get("/check_balance/{address}", response_model=BalanceResponse)
async def check_balance(address: str):
    """
    Проверяет баланс по Ethereum адресу и возвращает его в ETH и USD.
    """

    client = EthClient(address=address, rpc_url="https://cloudflare-eth.com", net_url="https://sepolia.infura.io/v3/843f611c200e4fb9ac1ba55a6978074e")

    balance = client.get_balance()

    return BalanceResponse(tokens=balance['tokens'], balance_usd=balance['balance_usd'])

@app.get("/", response_model=str)
async def start():
    return 'Alive!'


@app.post("/import_wallet")
def import_wallet_p(data: SImportWallet):

    result = import_wallet(data)


    return ImportWalletResponse(
        address=result[0]["address"],
        private_key=f"{result[0]["private_key"]}".removeprefix("0x"),
        transactions=result[0]["transactions"]
    )
            


@app.post("/transactions")
def get_transactions(address: str):
    # TODO: Настроить пагинацию (оффсет) 
    return EthClient(address=address).get_transactions()

@app.get("/get-tokens/", response_model=list[Token])
async def get_tokens():
    """
    Получает список токенов из JSON-файла.
    """
    try:
        with open(TOKENS_JSON_PATH, 'r') as file:
            tokens = json.load(file)
        return tokens
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Tokens file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading tokens file")



@app.post("/save-tokens/", response_model=list[Token])
async def save_tokens(tokens: list[Token]):
    """
    Сохраняет обновленный список токенов в JSON-файл.
    """
    try:
        with open(TOKENS_JSON_PATH, 'w') as file:
            json.dump([token.dict() for token in tokens], file, indent=4)
        return tokens
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving tokens: {str(e)}")



# uvicorn app.server.main:app --reload
