from pydantic import BaseModel, field_validator, model_validator, ValidationError
from typing import Optional
from bip_utils import Bip44, Bip44Coins, Bip44Changes
from eth_keys import keys
from eth_utils import to_checksum_address


from auxiliary import EthClient, to_seed
from mnemonic import Mnemonic


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
    def validate_mnemonic(cls, mnemonic):
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
    
# Пример проверки валидации
# try:
#     wallet = SImportWallet(
#         rpc_url='https://example.com', 
#         net_url='https://example.net', 
#         mnemonic=['word1', 'word2', 'word1', 'word2', 'word1', 'word2', 'word1', 'word2', 'word1', 'word2', 'word1', 'word2'],
#         private="isadiufidsiduhf"
#     )
#     print("Валидация прошла успешно!")
# except ValidationError as e:
#     print(e)


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
    if data.mnemonic:
    # Создаем объект мнемоники    
        mnemonic = " ".join(data.mnemonic)
        mnemo = Mnemonic("english")
        
        if mnemo.check(mnemonic):
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

                # Сохраняем результаты в список
                result.append({
                    "address": address,
                    "private_key": private_key,
                    "transactions" : transactions
                })

                return result

    elif data.private:
        private_key = keys.PrivateKey(bytes.fromhex(data.private))
        public_key= private_key.public_key

        address = public_key.to_address()
        checksum_address = to_checksum_address(address)

        client = EthClient(
            address=checksum_address,
            rpc_url=data.rpc_url,
            net_url=data.net_url,
        )

        result = [{
            "address": checksum_address,
            "private_key": private_key,
            "transactions" : client.get_transactions()
        }]
        
        return result
    



