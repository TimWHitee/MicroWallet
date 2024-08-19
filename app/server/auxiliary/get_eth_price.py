import requests

def get_eth_price_func():
    """
    Получает текущую стоимость эфира (ETH) в долларах США (USD).
    
    :return: Стоимость ETH в USD (float).
    """
    url = 'https://api.bitfinex.com/v1/pubticker/ethusd'
    
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        eth_price = data['last_price']
        return float(eth_price)
    else:
        raise Exception(f"Ошибка запроса: {response.status_code} {response.text}")


