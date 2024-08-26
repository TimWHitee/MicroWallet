from fastapi import APIRouter, HTTPException
import json, os, sys

from backend.schemas.response_ss import Token
token_router = APIRouter()

TOKENS_JSON_PATH = "backend/schemas/tokens.json"



@token_router.get("/get-tokens/", response_model=list[Token])
async def get_tokens():
    """
    Получает список токенов из JSON-файла.
    """
    try:
        with open(TOKENS_JSON_PATH, 'r') as file:
            tokens = json.load(file)
        return tokens
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Tokens file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading tokens file")



@token_router.post("/save-tokens/", response_model=list[Token])
async def save_tokens(tokens: list[Token]):
    """
    Сохраняет обновленный список токенов в JSON-файл.
    """
    try:
        with open(TOKENS_JSON_PATH, 'w') as file:
            json.dump([token.dict() for token in tokens], file, indent=4)
        return tokens
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving tokens: {str(e)}")

