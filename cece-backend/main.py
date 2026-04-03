# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from primary.inference import predict_chord
from secondary.secondary_utils import sequence_analysis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Request Models
# -----------------------------



# -----------------------------
# Routes
# -----------------------------

@app.get("/predict_next")
def predict_next(chords: str):
    """Primary model chord prediction."""
    result = predict_chord(chords)
    return {"result": result}


@app.get("/explain")
def explain(chords: str):
    text = sequence_analysis(chords)
    print(text)
    return {"explanation": text}
