from secondary.model_loader import get_secondary_model
import time
from secondary.prompts import prompts

vicuna_model, DEVICE = get_secondary_model()

def sequence_analysis(chord_list: str):
    start = time.time()
    
    prompt = prompts["explainSequence"]
    prompt += chord_list

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

