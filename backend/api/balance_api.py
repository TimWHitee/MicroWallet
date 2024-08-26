from fastapi import APIRouter

from backend.scripts import EthClient
from backend.schemas.response_ss import BalanceResponse 

balance_router = APIRouter()

@balance_router.get("/check_balance/{address}", response_model=BalanceResponse)
async def check_balance(address: str):
    """
    Проверяет баланс по Ethereum адресу и возвращает его в ETH и USD.
    """

    client = EthClient(
        address=address, 
        rpc_url="https://cloudflare-eth.com", 
        net_url="https://sepolia.infura.io/v3/843f611c200e4fb9ac1ba55a6978074e"
    )

    balance = client.get_balance()

    return BalanceResponse(tokens=balance['tokens'], balance_usd=balance['balance_usd'])
