from app import import_wallet, SImportWallet

wallet = SImportWallet(
        rpc_url='https://cloudflare-eth.com', 
        net_url='https://sepolia.infura.io/v3/843f611c200e4fb9ac1ba55a6978074e', 
        # mnemonic=['word1', 'word2', 'word1', 'word2', 'word1', 'word2', 'word1', 'word2', 'word1', 'word2', 'word1', 'word2'],
        private="0x3d675cc99893d57fb13843176e6d8ce5ba51ae903577e4003c67151062e31e95"
    )

import_wallet(data=wallet, num_wallets=1)