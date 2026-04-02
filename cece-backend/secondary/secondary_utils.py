from secondary.model_loader import get_secondary_model

vicuna_model, DEVICE = get_secondary_model()

def explain_chords(chord_list: str):
    """Use the secondary model to explain the harmonic logic."""
    prompt = f"Explain the harmonic logic of this chord sequence: {chord_list}"

    response = vicuna_model(
        prompt,
        max_tokens=256,
        temperature=0.7,
        stop=["</s>"]
    )

    return response["choices"][0]["text"].strip()

