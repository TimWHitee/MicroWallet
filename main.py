from backend import (
    create_router,
    import_router,
    token_router,
    balance_router
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import uvicorn

app = FastAPI()

origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(create_router)
app.include_router(import_router)
app.include_router(token_router)
app.include_router(balance_router)


@app.get("/")
async def start():
    return 'Alive!'


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)