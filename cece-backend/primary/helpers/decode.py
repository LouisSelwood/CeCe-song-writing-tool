import torch;
import primary.helpers.music_theory as theory

CHORD_DEGREE_TOKENS = [
    "CHORD_DEGREE__0", "CHORD_DEGREE__1", "CHORD_DEGREE__2",
    "CHORD_DEGREE__3", "CHORD_DEGREE__4", "CHORD_DEGREE__5", "CHORD_DEGREE__6"
]

TONALITY_DEGREE_TOKENS = [
    f"TONALITY_DEGREE__{i}" for i in range(12)
]

TONALITY_MODE_TOKENS = [
    "TONALITY_MODE__M",
    "TONALITY_MODE__m"
]

CHORD_EXTENSION_TOKENS = [
    "CHORD_EXTENSION__",
    "CHORD_EXTENSION__7",
    "CHORD_EXTENSION__6",
    "CHORD_EXTENSION__64",
    "CHORD_EXTENSION__65",
    "CHORD_EXTENSION__43",
    "CHORD_EXTENSION__2",
    "CHORD_EXTENSION__(sus2)",
    "CHORD_EXTENSION__(sus4)",
    "CHORD_EXTENSION__(+)",
    "CHORD_EXTENSION__6(sus2)",
    "CHORD_EXTENSION__6(sus4)",
    "CHORD_EXTENSION__64(sus2)",
    "CHORD_EXTENSION__64(sus4)",
    "CHORD_EXTENSION__6(+)",
    "CHORD_EXTENSION__64(+)",
]

POSITION_RULES = {
    0: ["CHORD_CHANGE"],
    1: CHORD_DEGREE_TOKENS,
    2: TONALITY_DEGREE_TOKENS,
    3: TONALITY_MODE_TOKENS,
    4: CHORD_EXTENSION_TOKENS,
    5: ["CHORD_OCTAVE__0"],
}

def apply_position_mask(logits: torch.Tensor, position: int, vocab: dict) -> torch.Tensor:
    """
    Masks all invalid tokens at a given chord position to -inf.
    
    Args:
        logits:   raw logit tensor from model, shape [vocab_size]
        position: current position in the 6-token chord block (0-5)
        vocab:    tokenizer vocab dict {token_string: token_id}
    
    Returns: masked logit tensor, same shape
    """

    # Start with everything masked to -inf
    masked = torch.full(logits.shape, float('-inf'))

    # Get the list of valid tokens at this position
    valid_tokens = POSITION_RULES[position]

    # For each valid token, copy its real logit score back in
    for token in valid_tokens:
        if token in vocab:
            token_id = vocab[token]
            masked[token_id] = logits[token_id]

    return masked

def apply_temperature(logits, temp):
    return (logits / temp)



def parse_token_value(token):
    return token.split("__")[1]

def degree_to_semitone(chord_degree, tonality_degree, mode):
    chord_degree = int(chord_degree)
    tonality_degree = int(tonality_degree)

    if(mode == "M"):
        scale = theory.MAJOR_SCALE
    else:
        scale = theory.MINOR_SCALE

    # Tonality root offset (key shift)
    try:
        tonality_offset = scale[tonality_degree % 7]
    except Exception as e:
        print("TONALITY-------")
        print(tonality_degree)
        tonality_offset = 0

    # Chord degree offset
    chord_offset = scale[chord_degree]

    # Combined semitone offset
    return (tonality_offset + chord_offset) % 12


def get_triad_quality(degree, mode):
    degree = int(degree)
    if mode == "M":
        quality = theory.MAJOR_SCALE_QUALITIES[degree]
    else:
        quality = theory.MINOR_SCALE_QUALITIES[degree]
    return "" if quality == "major" else "m"


def get_bass_note(root, extension, tonality, mode):
    try:
        bass_degree = theory.INVERSION_BASS[extension]
    except Exception as e:
        return ""
    
    if(mode == "M"):
        scale = theory.MAJOR_SCALE
    else:
        scale = theory.MINOR_SCALE

    root_semitone = degree_to_semitone(root, tonality, mode )
    interval = scale[6] if bass_degree == 7 else scale[bass_degree]
    bass_semitone = (root_semitone + interval) % 12
    
    return theory.SEMITONE_TO_NOTE[bass_semitone]
    

    
  
def get_extensions(extension):
    try:
        return theory.EXTENSION_QUALITY[extension]
    except Exception as e:
        raise ValueError(f"Recieved Invalid Token '{extension}'")

def decode_token_result(chordTokens: list[str]):
    chord_degree_token = parse_token_value(chordTokens[1])
    tonality_degree_token = parse_token_value(chordTokens[2])
    tonality_mode_token = parse_token_value(chordTokens[3])
    chord_extension_token = parse_token_value(chordTokens[4])
    chord_root = theory.SEMITONE_TO_NOTE[degree_to_semitone(chord_degree_token, tonality_degree_token, tonality_mode_token)]
    chord_quality = get_triad_quality(chord_degree_token, tonality_mode_token)
    bass = get_bass_note(chord_degree_token, chord_extension_token, tonality_degree_token, tonality_mode_token)
    extension = get_extensions(chord_extension_token)
    if(bass == ""):
        return chord_root + chord_quality + extension
    else:
        return chord_root + chord_quality + extension + "/" + bass
    

def get_unique_probabilities(probs):
    probs.sort(key=lambda x: x[0], reverse=True)
    unique = {}
    for logp, chord in probs:
        if chord not in unique:
            unique[chord] = logp
    return unique
