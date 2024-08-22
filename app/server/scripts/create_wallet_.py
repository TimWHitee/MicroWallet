from ..auxiliary import (
    generate_addresses, 
    to_seed,
    generate_mnemonic_12, 
    generate_mnemonic_24, 
    generate_entropy
)


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

    str_mnemonic = " ".join(mnemonic)

    seed = to_seed(str_mnemonic).hex()

    address_data = generate_addresses(mnemonic_phrase=str_mnemonic,num_addresses=1)

    private_key = '0x' + address_data[0]['private_key']

    public_key = '0x' + address_data[0]['public_key']

    address = address_data[0]['address']

    wallet_data = {
        "mnemonic": mnemonic,
        "private_key": private_key,
        "public_key": public_key,
        "address": address,
        "seed": seed,
        "entropy": entropy

    }

    return wallet_data


if __name__ == "__main__":
    wallet = create_wallet()
    print(wallet)