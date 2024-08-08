import sha3
from ecdsa import VerifyingKey, SECP256k1 
# pip install ecdsa pysha3


def get_ethereum_address(public_key: str) -> str:
    """
    Генерирует Ethereum-адрес из публичного ключа в формате шестнадцатеричной строки.

    :param public_key: Публичный ключ в формате шестнадцатеричной строки. Может начинаться с префикса '0x'.
    :return: Ethereum-адрес в формате шестнадцатеричной строки с префиксом '0x'.
    
    :raises ValueError: Если формат публичного ключа некорректен.
    
    Шаги выполнения:
    1. Декодирует публичный ключ из шестнадцатеричной строки.
    2. Создает объект VerifyingKey из декодированного публичного ключа.
    3. Преобразует публичный ключ в несжатый формат (64 байта).
    4. Применяет хэш-функцию Keccak256 к несжатому публичному ключу.
    5. Извлекает последние 20 байт хэша и преобразует их в формат Ethereum-адреса.
    """
    # Декодируем публичный ключ из шестнадцатеричной строки
    public_key_bytes = bytes.fromhex(public_key[2:] if public_key.startswith('0x') else public_key)
    # Создаем объект VerifyingKey из байтов публичного ключа
    verifying_key = VerifyingKey.from_string(public_key_bytes, curve=SECP256k1)
    
    # Преобразуем публичный ключ в несжатый формат (64 байта, без 0x04 префикса)
    uncompressed_public_key = verifying_key.to_string()
    
    # Применяем хэш Keccak256
    k = sha3.keccak_256()
    k.update(uncompressed_public_key)
    keccak_hash = k.digest()
    
    # Получаем последние 20 байт хэша
    address = '0x' + keccak_hash[-20:].hex()
    return address

# Пример использования:
if __name__ == '__main__':
    public_key_hex = '0x03b00121276ae5d77bb7d62e8eea8fedd7ec1db051bf7921c984380cf4a1bb9a95'
    address = get_ethereum_address(public_key_hex)
    print(f"Ethereum-адрес: {address}")
