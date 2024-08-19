from pydantic import BaseModel, field_validator
from typing import Optional
from bip_utils import Bip44, Bip44Coins, Bip44Changes

from v1 import EthClient
from auxiliary import to_seed
from mnemonic import Mnemonic


class SImportWallet(BaseModel):
    mnemonic: list[str]
    passphrase: Optional[str] = None
    rpc_url: str
    net_url: str

    @field_validator("mnemonic")
    def validate_mnemonic(cls, mnemonic):
        mnemo = Mnemonic("english")

        if len(mnemonic) not in (12, 24) and mnemo.check(mnemonic):
            raise ValueError("Wrong list length!")
        return mnemonic


def import_wallet(data: SImportWallet, num_wallets: int = 1):
    '''
    Функция получает на входе мнемоническую фразу (12 или 24 слова) и passphrase.
    При этом данны сначала валидируются с помощью класса pydantic SImportWallet
    Отдает данные: 
        адрес кошелька
        Приватный ключ
        баланс
        историю транзакций
    '''

    # Создаем объект мнемоники    
    mnemonic = " ".join(data.mnemonic)

    # Создаем seed из мнемоники
    seed_bytes = to_seed(mnemonic)

    # Инициализируем Bip44 для Ethereum
    bip44_mst = Bip44.FromSeed(seed_bytes, Bip44Coins.ETHEREUM)

    # Список для хранения результатов
    result = []

    # Генерация кошельков
    for i in range(num_wallets):
        bip44_acc = bip44_mst.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(i)

        # Получение адреса и приватного ключа
        address = bip44_acc.PublicKey().ToAddress()
        private_key = bip44_acc.PrivateKey().Raw().ToHex()

        # Инициализация клиента
        client = EthClient(
            address=address,
            rpc_url=data.rpc_url,
            net_url=data.net_url,
        )

        # Получение истории транзакций
        transactions = client.get_transactions(
            num_transactions=10
        )

        # Получение баланса
        balance = client.get_balance()

        # Сохраняем результаты в список
        result.append({
            "address": address,
            "private_key": private_key,
            "balance" : balance,
            "transactions" : transactions
        })
    
    return result



