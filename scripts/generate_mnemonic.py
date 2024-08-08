import hashlib


"""

Функция генерирует seed-phrase (mnemonic) из переданной энтропии (256 бит) по стандарту BIP39

"""
def generate_mnemonic(entropy):

    # Хэшируется энтропия для получения контрольной суммы 
    priv_hashed = hashlib.sha256(bytes.fromhex(entropy)).digest().hex()

    # Контрольная сумма - первые 8 бит (2 символа) хэша энтропии 
    CS = priv_hashed[:2]

    # новая строка - энтропия с добавлением чексум в конец
    CString = entropy + CS

    # полное бинарное представление
    binary = ''.join(format(byte, '08b') for byte in bytes.fromhex(CString))

    # массив индексов в бинарном виде(каждые 11 битов, тк 2^11 = 2048 - кол-во слов в BIP39)
    binary_indices = [binary[i*11:(i+1) * 11] for i in range(24)]

    # тот же массив, но в десятичном виде
    indices = [int(i,2) for i in binary_indices]

    # распаковка списка всех слов из BIP39
    with open('BIPS/bip39.txt') as file:
        data = []
        for i in range(2048):
            data.append(file.readline().strip())

    # составление мнемонической фразы по индексам 
    mnemonic = [data[i] for i in indices]

    return mnemonic
# пример использования
entropy = "CB6BE962FCD00B25012500F14D8525018FD81AA0D097194F1887F7F16B18AE22"
print(generate_mnemonic(entropy))

