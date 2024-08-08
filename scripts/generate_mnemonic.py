import hashlib


def generate_mnemonic_24(entropy):
    """
    Генерирует мнемоническую фразу из 24 слов по стандарту BIP39 из переданной энтропии (256 бит).

    `Ключевые шаги`
    1. Проверка длины входной энтропии.
    2. Хэширование энтропии для получения контрольной суммы.
    3. Формирование строки с бинарным представлением энтропии и контрольной суммы.
    4. Разделение бинарной строки на 11-битовые блоки и преобразование их в индексы.
    5. Использование индексов для создания мнемонической фразы из слов списка BIP39.

    :param entropy: Энтропия в виде шестнадцатеричной строки (64 символа для 256 бит).
    :return: Мнемоническая фраза в виде списка из 24 слов.

    :raises ValueError: Если длина энтропии некорректна или файл со списком слов BIP39 содержит неправильное количество слов.
    """
    # Проверка длины энтропии (должна быть 64 символа для 256 бит)
    if len(entropy) != 64:
        raise ValueError("Entropy should be 64 hexadecimal characters (256 bits) long")
    
    # Проверка на то, что строка содержит только шестнадцатеричные символы
    try:
        bytes.fromhex(entropy)
    except ValueError:
        raise ValueError("Entropy should contain only hexadecimal characters")

    # Хэширование энтропии для получения контрольной суммы
    priv_hashed = hashlib.sha256(bytes.fromhex(entropy)).digest().hex()

    # Контрольная сумма - первые 8 бит (1 байт) хэша энтропии в 256 бит
    CS = bin(int(priv_hashed, 16))[2:].zfill(256)[:8]

    # Новая строка - энтропия с добавлением контрольной суммы в конец
    entropy_bits = bin(int(entropy, 16))[2:].zfill(256) + CS

    # Полное бинарное представление
    binary = entropy_bits

    # Массив индексов в бинарном виде (каждые 11 битов, т.к. 2^11 = 2048 - кол-во слов в BIP39)
    binary_indices = [binary[i*11:(i+1) * 11] for i in range(24)]

    # Тот же массив, но в десятичном виде
    indices = [int(i, 2) for i in binary_indices]

    # Распаковка списка всех слов из BIP39
    with open('BIPS/bip39.txt') as file:
        data = [line.strip() for line in file.readlines()]

    # Проверка количества слов в файле (должно быть 2048)
    if len(data) != 2048:
        raise ValueError("The bip39 word list should contain exactly 2048 words")

    # Составление мнемонической фразы по индексам
    mnemonic = [data[i] for i in indices]

    return mnemonic



def generate_mnemonic_12(entropy):
    """
    Генерирует мнемоническую фразу из 12 слов по стандарту BIP39 из переданной энтропии (128 бит).

    `Ключевые шаги`
    1. Проверка длины входной энтропии.
    2. Хэширование энтропии для получения контрольной суммы.
    3. Формирование строки с бинарным представлением энтропии и контрольной суммы.
    4. Разделение бинарной строки на 11-битовые блоки и преобразование их в индексы.
    5. Использование индексов для создания мнемонической фразы из слов списка BIP39.

    :param entropy: Энтропия в виде шестнадцатеричной строки (32 символа для 128 бит).
    :return: Мнемоническая фраза в виде списка из 12 слов.

    :raises ValueError: Если длина энтропии некорректна или файл со списком слов BIP39 содержит неправильное количество слов.
    """

    # Проверка длины энтропии (должна быть 32 символа для 128 бит)
    if len(entropy) != 32:
        raise ValueError("Entropy should be 32 hexadecimal characters (128 bits) long")

    # Хэширование энтропии для получения контрольной суммы 
    priv_hashed = hashlib.sha256(bytes.fromhex(entropy)).digest().hex()

    # Контрольная сумма - первые 4 бита (полбайта) хэша энтропии в 128 бит
    CS = bin(int(priv_hashed, 16))[2:].zfill(256)[:4]

    # Новая строка - энтропия с добавлением контрольной суммы в конец
    entropy_bits = bin(int(entropy, 16))[2:].zfill(128) + CS

    # Полное бинарное представление
    binary = entropy_bits

    # Массив индексов в бинарном виде (каждые 11 битов, т.к. 2^11 = 2048 - кол-во слов в BIP39)
    binary_indices = [binary[i*11:(i+1) * 11] for i in range(12)]

    # Тот же массив, но в десятичном виде
    indices = [int(i, 2) for i in binary_indices]

    # Распаковка списка всех слов из BIP39
    with open('BIPS/bip39.txt') as file:
        data = [line.strip() for line in file.readlines()]

    # Проверка количества слов в файле (должно быть 2048)
    if len(data) != 2048:
        raise ValueError("The bip39 word list should contain exactly 2048 words")

    # Составление мнемонической фразы по индексам
    mnemonic = [data[i] for i in indices]

    return mnemonic


# Пример использования

entropy_256 = "CB6BE962FCD00B25012500F14D8525018FD81AA0D097194F1887F7F16B18AE22"

entropy_128 = "b861e4cc661e243ece4ce427a07e7538"

print(f"mnemonic 24-words : {generate_mnemonic_24(entropy_256)}")
print(f"mnemonic 12-words : {generate_mnemonic_12(entropy_128)}")
