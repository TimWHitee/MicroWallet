from pydantic import BaseModel
from typing import List


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

class Token(BaseModel):
    name: str
    address: str