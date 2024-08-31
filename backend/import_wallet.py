from bip_utils import Bip44, Bip44Coins, Bip44Changes
from eth_keys import keys
from eth_utils import to_checksum_address

from backend.schemas.request_ss import SImportWallet

from backend.scripts import EthClient, to_seed
from mnemonic import Mnemonic


def import_wallet_func(data: SImportWallet, num_wallets: int = 1):
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
                print(address)
                private_key = bip44_acc.PrivateKey().Raw().ToHex()

                # Сохраняем результаты в список
                result.append({
                    "address": address,
                    "private_key": private_key,
                })

                return result

    elif data.private:
        private_key = keys.PrivateKey(bytes.fromhex(data.private))
        public_key= private_key.public_key

        address = public_key.to_address()
        checksum_address = to_checksum_address(address)
        print(checksum_address)

        result = [{
            "address": checksum_address,
            "private_key": private_key,
        }]
        
        return result
    



