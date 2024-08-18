from web3 import Web3
from .get_eth_price import get_eth_price
import time
def get_eth_balance(address, rpc_url='https://cloudflare-eth.com'):
    """
    Получает баланс Ethereum-адреса через web3.py.
    
    :param address: Ethereum-адрес (строка).
    :param rpc_url: URL RPC-сервера Ethereum (например, публичный узел или локальный узел).
    :return: Баланс в Ether (float).
    """
    # Подключаемся к узлу Ethereum через RPC
    web3 = Web3(Web3.HTTPProvider(rpc_url))
    
    # Проверка подключения

    while not web3.is_connected():
        print("Unable to connect to Etherium node. Retrying in 3 sec...")
        time.sleep(3)
        web3 = Web3(Web3.HTTPProvider(rpc_url))

    # Получаем баланс в Wei
    balance_wei = web3.eth.get_balance(address)
    
    # Преобразуем Wei в Ether
    balance_eth = float(round(web3.from_wei(balance_wei, 'ether'),6))
    balance = {
        'balance_eth': balance_eth,
        'balance_usd' : round(balance_eth * get_eth_price(),2)
    }
    return balance
# Пример использования
if __name__ == "__main__":
    rpc_url = 'https://cloudflare-eth.com'  # Публичный RPC URL от Cloudflare
    address = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'  # Замените на нужный адрес

    balance = get_eth_balance(address, rpc_url)
    print(balance)
