from web3 import Web3
from .get_eth_price import get_eth_price_func
from time import sleep
import requests
import os
from dotenv import load_dotenv
import json
load_dotenv()

ERC20_ABI = json.loads('[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"}]')


class EthClient:
    def __init__(self, address: str, rpc_url: str, net_url: str) -> None:
        '''
        Инициализирует соединение с узлом Ethereum и сохраняет адрес.

        :param address: Ethereum-адрес отправителя или кошелька, информация о котором требуется.
        :param rpc_url: URL RPC-сервера Ethereum.
        :param net_url: URL сети, в которой будут совершаться транзакции.
        '''
        self.address = address
        self.web3 = None
        self.web3_net = None

        for _ in range(200):
            self.web3 = Web3(Web3.HTTPProvider(rpc_url))
            self.web3_net = Web3(Web3.HTTPProvider(net_url))

            if self.web3.is_connected():
                break
            print(f"Не удалось подключиться к Ethereum узлу после {_ + 1} попыток")
            sleep(1)
                
                
    def get_balance(self) -> dict:
        '''
        Получение баланса кошелька, адрес которого задан при инициализации
        '''
        balance_wei = self.web3.eth.get_balance(self.address)
    
    # Преобразуем Wei в Ether
        balance_eth = float(round(self.web3.from_wei(balance_wei, 'ether'),6))
        balance = {
            'balance_usd': round(balance_eth * get_eth_price_func(), 2),
            'tokens': {
                'ETH': balance_eth
            }
        }

        with open('app/utils/tokens.json') as file:
            token_contracts = json.load(file)

        # Получение балансов токенов
        for token in token_contracts:
            try:
                token_contract = self.web3.eth.contract(address=Web3.to_checksum_address(token['address']), abi=ERC20_ABI)
                balance_token_wei = token_contract.functions.balanceOf(self.address).call()
                decimals = token_contract.functions.decimals().call()
                balance_token = balance_token_wei / (10 ** decimals)
                balance['tokens'][token['name']] = balance_token
                print("Токен добавлен")
            except:
                continue
        return balance


    def get_transactions(self, num_transactions: int =  10) -> list:
        '''
        Получение последних n транзакций кошелька

        :param num_transactions: нужной для получения количество транзакций
        :return: список транзакций
        '''
        b = os.environ.get("ETHERSCAN")
        url = f"https://api.etherscan.io/api?module=account&action=txlist&address={self.address}&sort=desc&apikey={b}"
    
        response = requests.get(url)
        data = response.json()

        if data['status'] != "1":
            return ["No transactions found"]

        # Получаем последние n транзакций
        result = data['result'][:num_transactions]
        
        transactions = []

        for i in result:
            transactions.append(i["hash"])

        return transactions
    

    def sign_transaction(
            self, 
            private_key: str, 
            to_address: str, 
            amount_eth: float, 
            net_id: int = 11155111
    ):
        '''
        Подпись транзакции

        :param private_key: Приватный ключ кошелька-отправителя
        :param to_address: Адрес кошелька-акцептора
        :param amount_eth: Количество Эфира для отправки
        :param net_id: ID сети (по умолчанию стоит ID для тестнета sepolia)
        '''

        final_amount = self.web3_net.to_wei(amount_eth, "ether")

        nonce = self.web3_net.eth.get_transaction_count(self.address)

        transaction = {
            'to': to_address,
            'value': final_amount,
            'gas': 21000,  # Количество газа для простой транзакции
            'gasPrice': self.web3_net.to_wei('1', 'gwei'),  # Цена за единицу газа
            'nonce': nonce,
            'chainId': net_id  # ID сети Sepolia (11155111)
        }

        signed_tx = self.web3_net.eth.account.sign_transaction(transaction, private_key)
        tx_hash = self.web3_net.eth.send_raw_transaction(signed_tx.rawTransaction)

        return self.web3_net.to_hex(tx_hash)
    


# Пример использования
if __name__ == "__main__":
    rpc_url = 'https://cloudflare-eth.com'  # Публичный RPC URL от Cloudflare
    address = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'  # Замените на нужный адрес

    client = EthClient(
        address= '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
        rpc_url="https://cloudflare-eth.com"
    )

    print(client.get_balance())
