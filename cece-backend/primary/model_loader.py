
from transformers import GPT2LMHeadModel, AutoTokenizer
import torch

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Loading MusicLang model...")

model = GPT2LMHeadModel.from_pretrained("musiclang/musiclang-chord-v2-4k").to(DEVICE)
tokenizer = AutoTokenizer.from_pretrained("musiclang/musiclang-chord-v2-4k")

model.eval()

print("Model loaded successfully.")

def get_model():
    return model, tokenizer, DEVICE
