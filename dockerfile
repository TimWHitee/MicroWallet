# Используем официальный образ Python
FROM python:3.12-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы requirements.txt и устанавливаем зависимости
COPY requirements.txt .

RUN apt-get update && apt-get install -y gcc build-essential libssl-dev
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект
COPY . .

# Запускаем сервер
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

LABEL name="sashajlohsky/micro_wallet_backend"
