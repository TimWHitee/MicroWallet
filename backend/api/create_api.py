from fastapi import APIRouter, HTTPException

from backend.create_wallet import create_wallet_func
from backend.schemas.response_ss import WalletResponse 

create_router = APIRouter()

@create_router.post("/create_wallet/", response_model=WalletResponse)
async def create_wallet_endpoint(words_in_mnemo: int = 24):
    try:
        wallet_data = create_wallet_func(words_in_mnemo)
        return wallet_data 
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))