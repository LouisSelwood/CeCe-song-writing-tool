from llama_cpp import Llama
import torch
import os

# Pick device info (llama-cpp runs on CPU, but we keep this for consistency)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Loading Vicuna secondary model...")

# Path to your quantised Vicuna model
# Absolute path — resolves relative to this file's location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "vicuna-7b-v1.5.Q4_K_M.gguf")


if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Vicuna model not found at: {MODEL_PATH}\n"
        f"Please download it and place it in the models/ folder."
    )

model = Llama(
    model_path=MODEL_PATH,
    n_ctx=4096,
    n_threads=8
)

print("Vicuna model loaded successfully.")

def get_secondary_model():
    return model, DEVICE