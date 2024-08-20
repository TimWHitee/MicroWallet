from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sys,os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from auxiliary import EthClient
from scripts import create_wallet, SImportWallet, import_wallet

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
    mnemonic: List[str]
    private_key: str
    public_key: str
    address: str
    seed: str
    entropy: str

class BalanceResponse(BaseModel):
    balance_eth: float
    balance_usd: float

class ImportWalletResponse(BaseModel):
    address : str
    private_key: str
    transactions : List[str]

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

    return BalanceResponse(balance_eth=balance['balance_eth'], balance_usd=balance['balance_usd'])

@app.get("/", response_model=str)
async def start():
    return 'Alive!'


@app.post("/import_wallet")
def import_wallet_p(data: SImportWallet):
    result = import_wallet(data)
    key = result[0]["private_key"]


    return ImportWalletResponse(
        address=result[0]["address"],
        private_key=f"{key}".removeprefix("0x"),
        transactions=result[0]["transactions"]
    )

@app.post("transactions")
def get_transactions(address: str):
    # TODO: Настроить пагинацию (оффсет) 
    return EthClient(address=address).get_transactions()

# uvicorn app.server.main:app --reload

# from scripts import import_wallet, SImportWallet

# wallet = SImportWallet(
#         # mnemonic=['reveal', 'august', 'credit', 'slow', 'time', 'buyer', 'decrease', 'orient', 'chicken', 'advance', 'outer', 'immense'],
#         private="7d47c0259ac1396956059af6ceaeaaf42fc38740ee710916d759da40dde88068"
#     ) 

# print(import_wallet(data=wallet, num_wallets=1))