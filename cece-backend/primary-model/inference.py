import torch
from model_loader import get_model

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

NOTE_TO_SEMITONE = {
    "C": 0, "C#": 1, "Db": 1,
    "D": 2, "D#": 3, "Eb": 3,
    "E": 4,
    "F": 5, "F#": 6, "Gb": 6,
    "G": 7, "G#": 8, "Ab": 8,
    "A": 9, "A#": 10, "Bb": 10,
    "B": 11
}

EXTENSION_TOKENS = {

    # ─── Root Position ───────────────────────────────
    "major":        "CHORD_EXTENSION__",
    "minor":        "CHORD_EXTENSION__",
    "dim":          "CHORD_EXTENSION__",
    "7":            "CHORD_EXTENSION__7",
    "maj7":         "CHORD_EXTENSION__7",
    "m7":           "CHORD_EXTENSION__7",
    "sus2":         "CHORD_EXTENSION__(sus2)",
    "sus4":         "CHORD_EXTENSION__(sus4)",
    "aug":          "CHORD_EXTENSION__(+)",

    # ─── 1st Inversion (3rd in bass) ─────────────────
    "major/3":      "CHORD_EXTENSION__6",
    "minor/3":      "CHORD_EXTENSION__6",
    "dim/3":        "CHORD_EXTENSION__6",
    "7/3":          "CHORD_EXTENSION__65",
    "maj7/3":       "CHORD_EXTENSION__65",
    "m7/3":         "CHORD_EXTENSION__65",
    "sus2/3":       "CHORD_EXTENSION__6(sus2)",
    "sus4/3":       "CHORD_EXTENSION__6(sus4)",
    "aug/3":        "CHORD_EXTENSION__6(+)",

    # ─── 2nd Inversion (5th in bass) ─────────────────
    "major/5":      "CHORD_EXTENSION__64",
    "minor/5":      "CHORD_EXTENSION__64",
    "dim/5":        "CHORD_EXTENSION__64",
    "7/5":          "CHORD_EXTENSION__43",
    "maj7/5":       "CHORD_EXTENSION__43",
    "m7/5":         "CHORD_EXTENSION__43",
    "sus2/5":       "CHORD_EXTENSION__64(sus2)",
    "sus4/5":       "CHORD_EXTENSION__64(sus4)",
    "aug/5":        "CHORD_EXTENSION__64(+)",

    # ─── 3rd Inversion (7th in bass — 7th chords only) ──
    "7/7":          "CHORD_EXTENSION__2",
    "maj7/7":       "CHORD_EXTENSION__2",
    "m7/7":         "CHORD_EXTENSION__2",

}



MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11]
MAJOR_SCALE_QUALITIES = ["major", "minor", "minor", "major", "major", "minor", "dim"]
MINOR_SCALE_QUALITIES = ["minor", "dim", "major", "minor", "minor", "major", "major"]
MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10]
CHROMATIC_DEGREES_MAJOR = {
    0: "0", 1: "b2", 2: "1", 3: "b3", 4: "2", 5: "3",
    6: "#4", 7: "4", 8: "b6", 9: "5", 10: "b7", 11: "6"
}

CHROMATIC_DEGREES_MINOR = {
    0: "0", 1: "b2", 2: "1", 3: "2", 4: "#2", 5: "3",
    6: "#4", 7: "4", 8: "b6", 9: "5", 10: "6", 11: "7"
}



def chords_to_tokens(chords: str):
    #Breaks down data into chords
    keyChords = chords.split("]")
    globalKey = keyChords[0].split(" ")
    chordStrings = [c for c in keyChords[1].split(":") if c.strip() != ""]

    #Initialises Token List
    tokens = []

    #Cycles Through Chords
    for chord in chordStrings:
        #Breaks chord into root (0), quality (1), key root (2), key mode (3)
        parts = chord.split(" ")
        tokens.extend(chord_tokeniser(parts[0], parts[1], parts[2], parts[3], globalKey[0], globalKey[1]))
    
    return(tokens)

def chord_tokeniser(root: str, quality: str, keyRoot: str, keyMode: str, globalKeyRoot: str, globalKeyMode: str):
    bass = ""
    if("/" in root):
        root_split = root.split("/")
        root = root_split[0]
        bass = root_split[1]

    
    #Validate Input
    if root not in NOTE_TO_SEMITONE:
        raise ValueError(f"Unknown root note: '{root}'")
    if keyRoot not in NOTE_TO_SEMITONE:
        raise ValueError(f"Unknown key root: '{keyRoot}'")
    if quality not in EXTENSION_TOKENS:
        raise ValueError(f"Unknown chord quality: '{quality}'")
    if keyMode not in ("major", "minor"):
        raise ValueError(f"Unknown key mode: '{keyMode}' — must be 'major' or 'minor'")
    if globalKeyRoot not in NOTE_TO_SEMITONE:
        raise ValueError(f"Unknown global key root: '{globalKeyRoot}'")
    if globalKeyMode not in ("major", "minor"):
        raise ValueError(f"Unknown global key mode: '{globalKeyMode}' — must be 'major' or 'minor'")
    
    #Calculate Interval from root
    rootSemi = NOTE_TO_SEMITONE[root]
    keySemi = NOTE_TO_SEMITONE[keyRoot]

    interval = (rootSemi - keySemi) % 12
    if(bass != ""):
        bass_interval = get_bass_interval(root, bass)
        quality += bass_interval
    #Gets Extension Token
    extensionToken = EXTENSION_TOKENS[quality]

    #Gets chord degree and tonality mode
    match keyMode:
        case "major":
            degree = CHROMATIC_DEGREES_MAJOR[interval]
            tonalityMode = "M"
        case "minor":
            degree = CHROMATIC_DEGREES_MINOR[interval]
            tonalityMode = "m"

    # ───────────────────────────────────────────────────────────────
    # MusicLang Tonality Degree:
    # TONALITY_DEGREE = degree of the *local key* relative to the *global key*
    # ───────────────────────────────────────────────────────────────
    globalSemi = NOTE_TO_SEMITONE[globalKeyRoot]
    localSemi = NOTE_TO_SEMITONE[keyRoot]

    tonalityInterval = (localSemi - globalSemi) % 12

    # choose scale based on GLOBAL key mode (MusicLang convention)
    match globalKeyMode:
        case "major":
            tonalityDegree = MAJOR_SCALE.index(tonalityInterval)
        case "minor":
            tonalityDegree = MINOR_SCALE.index(tonalityInterval)

    # Determine base triad quality
    if quality.startswith("m") and not quality.startswith("maj"):
        quality_base = "minor"
    elif quality.startswith("dim") or quality.startswith("o"):
        quality_base = "dim"
    else:
        quality_base = "major"

    # Expected diatonic quality
    if keyMode == "major":
        expected_quality = MAJOR_SCALE_QUALITIES[int(degree)]
    else:
        expected_quality = MINOR_SCALE_QUALITIES[int(degree)]

    # Detect modal mixture
    borrowed = (quality_base != expected_quality)

    # Set tonality mode
    if borrowed:
        tonalityMode = "m" if keyMode == "major" else "M"
    else:
        tonalityMode = "M" if keyMode == "major" else "m"

    #creates tokens
    tokens = ["CHORD_CHANGE"]
    tokens.append(f"CHORD_DEGREE__{degree}")
    tokens.append(f"TONALITY_DEGREE__{tonalityDegree}")
    tokens.append(f"TONALITY_MODE__{tonalityMode}")
    tokens.append(extensionToken)
    tokens.append("CHORD_OCTAVE__0")

    print(tokens)
    #returns tokens
    return(tokens)

def get_bass_interval(root: str, bass: str) -> str:

    root_semi = NOTE_TO_SEMITONE[root]   # NOTE: square brackets, not parentheses
    bass_semi = NOTE_TO_SEMITONE[bass]

    interval = (bass_semi - root_semi) % 12

    match interval:
        case 0:
            return ""       # root position
        case 3 | 4:
            return "/3"     # minor or major 3rd → 1st inversion
        case 6 | 7 | 8:
            return "/5"     # dim, perfect, aug 5th → 2nd inversion
        case 9 | 10 | 11:
            return "/7"     # dim, minor, major 7th → 3rd inversion
        case _:
            raise ValueError(f"Interval of {interval} semitones from '{root}' to '{bass}' is not a standard inversion.")
            

@torch.no_grad()
def get_logits(chordInput: str) -> dict[str, float]:
    print(chordInput)
    chord_sequence = chords_to_tokens(chordInput)
    # Join and encode
    input_ids = tokenizer.encode(chord_sequence, return_tensors="pt").to(DEVICE)

    # Forward pass
    outputs = model(input_ids)

    # Extract logits for the next token position only
    next_token_logits = outputs.logits[0, -1, :]  # shape: [vocab_size]

    # Build the full logit dict, filtered to chord tokens only
    logit_dict = {
        token: next_token_logits[token_id].item()
        for token, token_id in VOCAB.items()
        if token in CHORD_TOKENS
    }

    return logit_dict

