import sys
import os
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from app.server.scripts import *

class TestWalletFunctions(unittest.TestCase):

    def test_generate_entropy(self):
        entropy = generate_entropy(128)
        self.assertIsInstance(entropy, str)
        self.assertTrue(len(entropy) == 32)

        entropy = generate_entropy(256)
        self.assertIsInstance(entropy, str)
        self.assertTrue(len(entropy) == 64)

    def test_generate_mnemonic_24_words(self):
        entropy = generate_entropy(256)
        mnemonic = generate_mnemonic_24(entropy)
        self.assertIsInstance(mnemonic, list)
        self.assertEqual(len(mnemonic), 24)
        self.assertEqual(' '.join(generate_mnemonic_24('2aa103567a9e9beab7e87844b6f494388aaae131e32b2e139d921a5107bac2bf')),'click amount stereo vivid trust vocal text audit dwarf response celery illegal primary identify shy grace come ostrich goose cruise away talent april wonder')

    def test_generate_mnemonic_12_words(self):
        entropy = generate_entropy(128)
        mnemonic = generate_mnemonic_12(entropy)
        self.assertIsInstance(mnemonic, list)
        self.assertEqual(len(mnemonic), 12)
        self.assertEqual(' '.join(generate_mnemonic_12('f6f3ef59f0d32d729ef987f643c27840')),'want panda stool ticket crazy rich know couch wagon bulk own liar')

    def test_create_wallet(self):
        wallet = create_wallet()
        self.assertIsInstance(wallet, dict)
        self.assertIn('mnemonic', wallet)
        self.assertIn('seed', wallet)
        self.assertIn('private_key', wallet)
        self.assertIn('public_key', wallet)
        self.assertIn('address', wallet)
        self.assertIn('entropy', wallet)

    def test_generate_addresses(self):
        mnemonic = generate_mnemonic_12(entropy=generate_entropy(128))
        addresses = generate_addresses(' '.join(mnemonic),1)
        self.assertIsInstance(addresses, list)
        self.assertTrue(len(addresses) > 0)
        self.assertIn('private_key', addresses[0])
        self.assertIn('public_key', addresses[0])
        self.assertIn('address', addresses[0])

    def test_convert_mnemonic_to_seed(self):
        mnemonic = generate_mnemonic_12(entropy=generate_entropy(128))
        seed = to_seed(' '.join(mnemonic))
        self.assertIsInstance(seed.hex(), str)
        self.assertTrue(len(seed) > 0)

    def test_private_key_to_public_key(self):
        wallet = create_wallet()
        private_key = wallet['private_key']
        public_key = prvk_to_pubk(private_key)
        self.assertIsInstance(public_key, str)
        self.assertTrue(len(public_key) > 0)
        self.assertEqual(prvk_to_pubk('0xf6e32e4638dcb454c5ce1ebc5260bb60b0adb2a1fb06d3b01da2ad23b67b82c9'),'0x02b113a41a5e5e7dbe87ddfa9699469dfc2f59d5799a6f1ea5cb760f626c9d2f16')

    def test_get_ethereum_address_from_public_key(self):
        wallet = create_wallet()
        public_key = prvk_to_pubk(wallet['private_key'])
        ethereum_address = get_ethereum_address(public_key)
        self.assertIsInstance(ethereum_address, str)
        self.assertTrue(ethereum_address.startswith('0x'))
        self.assertEqual(len(ethereum_address), 42)

if __name__ == '__main__':
    unittest.main()
