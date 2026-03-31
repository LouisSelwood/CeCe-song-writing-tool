# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from inference import get_logits

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/getlogits")
def getlogits(chords: str):
    result = get_logits(chords)
    return {"result": result}
