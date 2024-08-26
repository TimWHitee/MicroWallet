import random 
import hashlib
import time
import math
# TODO: сделать более рандомную генерацию :) 

def generate_entropy(length: int) -> str:
    """
    Генерирует случайную энтропию длиной 128 или 256 бит в виде шестнадцатеричной строки.

    :param length: Длина энтропии в битах. Должна быть либо 128, либо 256.
    :return: Случайная энтропия в виде шестнадцатеричной строки, соответствующая указанной длине.
    
    :raises ValueError: Если `length` не равно 128 или 256 битам.
    """
    if length not in [128, 256]:
        raise ValueError("Length must be either 128 or 256 bits")


    with open('backend/schemas/bip39.txt') as file:
            data = [line.strip() for line in file.readlines()]

    random_indices = [random.randint(0,2047) for _ in range(24)]
    random_words = [data[i] for i in random_indices]
    ENT = str(random.randint(0, 2**20)) + str(time.time()*math.pi*math.e) + ''.join(random_words)
    ENT = hashlib.sha256(ENT.encode('utf-8')).hexdigest()

    # Обрезка до нужной длины
    if length == 128:
        ENT = ENT[:32]  # 128 бит = 32 шестнадцатеричных символа
    elif length == 256:
        ENT = ENT[:64]  # 256 бит = 64 шестнадцатеричных символа

    return ENT

# Пример использования
if __name__ == '__main__':
    print(generate_entropy(128))
    print(generate_entropy(256))
