from llama_cpp import Llama
import torch
import os

# llama-cpp runs on CPU, but we keep DEVICE for consistency
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Loading Vicuna secondary model...")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Switch to your Q3 model once downloaded
MODEL_PATH = os.path.join(BASE_DIR, "model", "vicuna-7b-v1.5.Q3_K_S.gguf")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Vicuna model not found at: {MODEL_PATH}\n"
        f"Please download it and place it in the model/ folder."
    )


model = Llama(
    model_path=MODEL_PATH,
    n_ctx=512,        # perfect for short explanations
    n_threads=8,     # max out your CPU
    verbose=False,     # speeds up load slightly
    use_mmap=False
)

model("Hello", max_tokens=1)
print("Vicuna model loaded successfully.")

def get_secondary_model():
    return model, DEVICE
