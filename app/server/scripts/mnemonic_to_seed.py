import hashlib


def to_seed(mnemonic: str, passphrase: str = "") -> bytes:
    """
    Генерирует seed из мнемонической фразы по стандарту BIP39 с использованием PBKDF2-HMAC-SHA512.

    :param mnemonic: Мнемоническая фраза (например, 12, 15, 18, 21 или 24 слова).
    :param passphrase: Опциональная дополнительная фраза для повышения безопасности (по умолчанию пустая строка).
    :return: Сид в виде байтов.
    """
    PBKDF2_ROUNDS = 2048  # Стандартное количество раундов для PBKDF2

    # Нормализация строк
    mnemonic = mnemonic.strip().lower()
    passphrase = passphrase.strip().lower()

    # Добавляем префикс к passphrase
    passphrase = "mnemonic" + passphrase

    # Преобразуем строки в байты
    mnemonic_bytes = mnemonic.encode("utf-8")
    passphrase_bytes = passphrase.encode("utf-8")

    # Генерация сидов с использованием PBKDF2-HMAC-SHA512
    stretched = hashlib.pbkdf2_hmac(
        "sha512", mnemonic_bytes, passphrase_bytes, PBKDF2_ROUNDS
    )

    return stretched[:64].hex()  # Возвращаем первые 64 байта (512 бит)

# Пример использования
if __name__ == "__main__":
    mnemonic_phrase = "tunnel snap pole engine conduct oval outdoor cash chest thrive dawn crime"
    seed = to_seed(mnemonic_phrase)
    print(f"Seed: {seed}")
