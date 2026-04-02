import torch
from primary.model_loader import get_model
import primary.helpers.chord_utils as chord
import primary.helpers.decode as decode


model, tokenizer, DEVICE = get_model()

# Build vocab once at startup
VOCAB = tokenizer.get_vocab()  # {token_string: token_id}
ID_TO_TOKEN = {v: k for k, v in VOCAB.items()}  # {token_id: token_string}

# Only the tokens that are musically valid in this model
CHORD_TOKENS = {
    token for token in VOCAB.keys()
    if any(token.startswith(prefix) for prefix in [
        "CHORD_CHANGE",
        "CHORD_DEGREE__",
        "CHORD_EXTENSION__",
        "CHORD_OCTAVE__",
        "TONALITY_DEGREE__",
        "TONALITY_MODE__",
    ])
}




def predict_chord(chordDSL: str):
    sequence_base = chord.chords_to_tokens(chordDSL)
    
    new_chord = []
    temp = 1
    output = []
    temperatures = [0.7, 1.0, 1.3, 1.6]
    for x in range(4):
        temp = temperatures[x]
        for i in range(40):
            sequence = sequence_base.copy()
            new_chord = []
            log_prob = 0
            for i in range(6):
                logits = get_logits(" ".join(sequence))
                next_position = len(sequence) % 6
                masked_logits = decode.apply_position_mask(logits, next_position, VOCAB)
                masked_logits = decode.apply_temperature(masked_logits, temp)
                probs = torch.softmax(masked_logits, dim=-1)
                next_id = torch.multinomial(probs, num_samples=1).item()
                log_prob += torch.log(probs[next_id]).item()
                next_token = ID_TO_TOKEN[next_id]
                new_chord.append(next_token)
                sequence.append(next_token)
            output.append([log_prob, decode.decode_token_result(new_chord)])
    output = decode.get_unique_probabilities(output)

    return output
    

@torch.no_grad()
def get_logits(sequence: str):
    # Join and encode
    input_ids = tokenizer.encode(sequence, return_tensors="pt").to(DEVICE)

    # Forward pass
    outputs = model(input_ids)

    # Extract logits for the next token position only
    next_token_logits = outputs.logits[0, -1, :]  # shape: [vocab_size]

    return next_token_logits

