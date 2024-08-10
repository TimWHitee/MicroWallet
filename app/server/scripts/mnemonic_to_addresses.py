from mnemonic import Mnemonic
from bip_utils import Bip44, Bip44Coins, Bip44Changes
from .mnemonic_to_seed import to_seed

def generate_addresses(mnemonic_phrase: str, num_addresses: int):
    """
    Генерировать адреса и ключи из мнемонической фразы.

    :param mnemonic_phrase: Мнемоническая фраза (seed phrase).
    :param num_addresses: Количество адресов для генерации.
    :return: Список сгенерированных адресов, приватных и публичных ключей.
    """
    # Создаем объект мнемоники
    mnemo = Mnemonic("english")
    
    # Проверяем корректность мнемоники
    if not mnemo.check(mnemonic_phrase):
        raise ValueError("Мнемоника некорректна")

    # Создаем seed из мнемоники
    seed_bytes = to_seed(mnemonic_phrase)
    # Инициализируем Bip44 для Ethereum
    bip44_mst = Bip44.FromSeed(seed_bytes, Bip44Coins.ETHEREUM)
    # Список для хранения результатов
    addresses = []

    # Генерация адресов
    for i in range(num_addresses):
        bip44_acc = bip44_mst.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(i)
        address = bip44_acc.PublicKey().ToAddress()
        private_key = bip44_acc.PrivateKey().Raw().ToHex()
        public_key = bip44_acc.PublicKey().RawCompressed().ToHex()

        # Сохраняем результаты в список
        addresses.append({
            "address": address,
            "private_key": private_key,
            "public_key": public_key
        })
    
    return addresses

# Пример использования:

if __name__ == '__main__':
    # Ваша мнемоническая фраза
    mnemonic_phrase = 'topic wear estate donkey impulse october open helmet father payment exotic wasp toddler acquire wool talent country lens valley pipe depart picnic seek hard'

    # Количество адресов для генерации
    num_addresses = 3

    addresses = generate_addresses(mnemonic_phrase, num_addresses)

    # Вывод результатов
    for i, addr in enumerate(addresses):
        print(f"Адрес {i}: {addr['address']}")
        print(f"Приватный ключ {i}: 0x{addr['private_key']}")
        print(f"Публичный ключ {i}: 0x{addr['public_key']}")
        print('--------------------------------')