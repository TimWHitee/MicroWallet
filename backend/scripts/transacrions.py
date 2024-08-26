from web3 import Web3

# Подключение к узлу через RPC-URL Cloudflare
cloudflare_rpc_url = 'https://cloudflare-eth.com'
web3 = Web3(Web3.HTTPProvider(cloudflare_rpc_url))

# Проверка подключения
if web3.is_connected():
    print('Connected to Ethereum blockchain')

# Задайте адрес, для которого нужно получить транзакции
address = '0xa567fAd25DA2721C9b55e94b935923bBee2dE887'

# Начальный и конечный блоки для сканирования
start_block = 20598201  # Можно начать с нулевого блока
end_block = web3.eth.block_number  # До текущего блока

# Получение всех транзакций для заданного адреса
transactions = []

for block_number in range(start_block, end_block + 1):
    block = web3.eth.get_block(block_number, full_transactions=True)
    print(block.transactions)
    for tx in block.transactions:
        if tx['from'] == address or tx['to'] == address:
            transactions.append(tx)
            print(f"\n\n{transactions}\n\n")

# Вывод транзакций
for tx in transactions:
    print(f"\n\n\n\nBlock: {tx['blockNumber']}, Hash: {tx['hash'].hex()}, From: {tx['from']}, To: {tx['to']}")
