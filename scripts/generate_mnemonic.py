import hashlib


"""

Функция генерирует seed-phrase (mnemonic) из переданной энтропии по стандарту BIP39

"""
def generate_mnemonic(entropy):
    # Convert entropy to bytes
    priv_hashed = hashlib.sha256(bytes.fromhex(entropy)).digest().hex()

    #
    CS = priv_hashed[:2]

    CString = entropy + CS

    binary = ''.join(format(byte, '08b') for byte in bytes.fromhex(CString))
    binary_indices = [binary[i*11:(i+1) * 11] for i in range(24)]

    indices = [int(i,2) for i in binary_indices]

    with open('bip39.txt') as file:
        data = []
        for i in range(2048):
            data.append(file.readline().strip())


    mnemonic = [data[i] for i in indices]

print(*mnemonic)


