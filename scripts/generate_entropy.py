import random 
import hashlib
import time

# TODO: сделать более рандомную генерацию :) 
"""
Генерирует энтропию длиной в 128 или 256 бит
"""
def generate_entropy(length: int) -> str:
    if length not in [128, 256]:
        raise ValueError("Length must be either 128 or 256 bits")

    # Генерация случайной энтропии
    ENT = str(random.randint(0, 2**20)) + str(time.time())
    ENT = hashlib.sha256(ENT.encode('utf-8')).hexdigest()

    # Обрезка до нужной длины
    if length == 128:
        ENT = ENT[:32]  # 128 бит = 32 шестнадцатеричных символа
    elif length == 256:
        ENT = ENT[:64]  # 256 бит = 64 шестнадцатеричных символа

    return ENT

# Пример использования

print(generate_entropy(128))
print(generate_entropy(256))
