from fastapi import APIRouter

from backend.import_wallet import import_wallet_func
from backend.schemas.request_ss import SImportWallet
from backend.schemas.response_ss import ImportWalletResponse

import_router = APIRouter()

@import_router.post("/import_wallet", response_model=ImportWalletResponse)
def import_wallet_p(data: SImportWallet):

    result = import_wallet_func(data)

    return ImportWalletResponse(
        address=result[0]["address"],
        private_key=f"{result[0]["private_key"]}",
    )