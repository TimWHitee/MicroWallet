from generate_entropy import generate_entropy
from generate_mnemonic import generate_mnemonic_12 , generate_mnemonic_24



def create_wallet(words_in_mnemo: int = 24):
    """
    Creates a wallet with a specified number of words in the mnemonic.
    :params: words_in_mnemo: The number of words in the mnemonic.
    :return: A dictionary containing the mnemonic and the wallet's private key.
    """
    if words_in_mnemo not in [12, 24]:
        raise ValueError("Words amount must be either 12 or 24")
    
    bits_in_entropy = 256 if words_in_mnemo == 24 else 128

    entropy = generate_entropy(length=bits_in_entropy)
    mnemonic = generate_mnemonic_24(entropy) if words_in_mnemo == 24 else generate_mnemonic_12(entropy)

    return mnemonic


if __name__ == "__main__":
    wallet = create_wallet()
    print(wallet)