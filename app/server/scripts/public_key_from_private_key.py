from ecdsa import SigningKey, SECP256k1

def prvk_to_pubk(private_key_hex: str) -> str:
    """
    Получить сжатый публичный ключ из приватного ключа.

    :param private_key_hex: Приватный ключ в шестнадцатеричном формате (без префиксов).
    :return: Сжатый публичный ключ в шестнадцатеричном формате.
    """
    # Преобразуем приватный ключ из шестнадцатеричной строки в байты
    private_key_bytes = bytes.fromhex(private_key_hex[2:] if private_key_hex.startswith('0x') else private_key_hex)

    # Создаем объект SigningKey из приватного ключа
    signing_key = SigningKey.from_string(private_key_bytes, curve=SECP256k1)
    
    # Получаем публичный ключ в сжатом формате
    public_key_compressed = signing_key.get_verifying_key().to_string('compressed')
    public_key_compressed_hex = public_key_compressed.hex()
    
    return f'0x{public_key_compressed_hex}'

# Пример использования:
if __name__ == '__main__':
    private_key_hex = '0x84202574aaf833aaf564641d6fe42736dfb8916c569f39947bdee3b048023997'
    compressed_key = prvk_to_pubk(private_key_hex)
    print(f"Сжатый публичный ключ: {compressed_key}")
