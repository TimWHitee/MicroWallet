from pydantic import BaseModel, field_validator, model_validator, ValidationError
from typing import Optional


class SImportWallet(BaseModel):
    mnemonic: Optional[list[str]] = None
    private: Optional[str] = None
    passphrase: Optional[str] = None
    rpc_url: Optional[str] = "https://cloudflare-eth.com"
    net_url: Optional[str] = "https://sepolia.infura.io/v3/843f611c200e4fb9ac1ba55a6978074e"

    @model_validator(mode="before")
    def validate_mnemonic_or_private(cls, values):
        mnemonic, private = values.get('mnemonic'), values.get('private')
        if not mnemonic and not private:
            raise ValueError('Either mnemonic or private key must be provided.')
        if mnemonic and private:
            raise ValueError('Only one of mnemonic or private key should be provided.')
        return values

    @field_validator("mnemonic")
    def validate_mnemonic(cls, mnemonic: list):
        if len(mnemonic) not in (12, 24):
            raise ValidationError("Wrong list length!")
        return mnemonic
    
    @field_validator("private")
    def validate_private(cls, private: str):
        if private.startswith("0x"):
            private = private[2:]

        # Проверяем длину и содержание
        if len(private) != 64 or not all(c in '0123456789abcdefABCDEF' for c in private):
            raise ValueError("Invalid private key.")
        
        return private