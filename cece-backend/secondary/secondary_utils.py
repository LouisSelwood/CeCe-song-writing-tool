from secondary.model_loader import get_secondary_model
import time

vicuna_model, DEVICE = get_secondary_model()

def sequence_analysis(chord_list: str):
    start = time.time()
    """Use the secondary model to explain the harmonic logic."""
    prompt = chord_list

    response = vicuna_model(
        prompt,
        max_tokens=512,
        temperature=0,
        top_p=0.8,
        stop=["</s>"]
    )
    duration = time.time() - start
    print(f"time taken: {duration}")
    return response["choices"][0]["text"].strip()

