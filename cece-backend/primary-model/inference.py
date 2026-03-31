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

    # ─── Basic Triads ───────────────────────────────
    "":          "CHORD_EXTENSION__",      # major triad (e.g. "C")
    "m":         "CHORD_EXTENSION__",      # minor triad (e.g. "Cm") — quality comes from CHORD_DEGREE in context
    "maj":       "CHORD_EXTENSION__",      # major triad alternate spelling
    "min":       "CHORD_EXTENSION__",      # minor triad alternate spelling
    "major":     "CHORD_EXTENSION__",
    "minor":     "CHORD_EXTENSION__",
    "aug":       "CHORD_EXTENSION__(+)",   # augmented (e.g. "Caug", "C+")
    "+":         "CHORD_EXTENSION__(+)",   # augmented alternate symbol
    "sus2":      "CHORD_EXTENSION__(sus2)",# suspended 2nd (e.g. "Csus2")
    "sus4":      "CHORD_EXTENSION__(sus4)",# suspended 4th (e.g. "Csus4")
    "sus":       "CHORD_EXTENSION__(sus4)",# suspended — defaults to sus4

    # ─── 7th Chords ─────────────────────────────────
    "7":         "CHORD_EXTENSION__7",     # dominant 7th (e.g. "G7")
    "maj7":      "CHORD_EXTENSION__7",     # major 7th (e.g. "Cmaj7")
    "M7":        "CHORD_EXTENSION__7",     # major 7th alternate symbol
    "m7":        "CHORD_EXTENSION__7",     # minor 7th (e.g. "Am7")
    "min7":      "CHORD_EXTENSION__7",     # minor 7th alternate spelling
    "dim7":      "CHORD_EXTENSION__7",     # diminished 7th (e.g. "Bdim7")
    "mM7":       "CHORD_EXTENSION__7",     # minor major 7th
    "minMaj7":   "CHORD_EXTENSION__7",     # minor major 7th alternate spelling

    # ─── Inversions (Triads) ────────────────────────
    "/3":        "CHORD_EXTENSION__6",     # first inversion — 3rd in bass (e.g. "C/E")
    "/5":        "CHORD_EXTENSION__64",    # second inversion — 5th in bass (e.g. "C/G")
    "inv1":      "CHORD_EXTENSION__6",     # first inversion explicit
    "inv2":      "CHORD_EXTENSION__64",    # second inversion explicit

    # ─── Inversions (7th Chords) ────────────────────
    "7/3":       "CHORD_EXTENSION__65",    # first inversion 7th — 3rd in bass
    "7/5":       "CHORD_EXTENSION__43",    # second inversion 7th — 5th in bass
    "7/7":       "CHORD_EXTENSION__2",     # third inversion 7th — 7th in bass
    "inv1_7":    "CHORD_EXTENSION__65",    # first inversion 7th explicit
    "inv2_7":    "CHORD_EXTENSION__43",    # second inversion 7th explicit
    "inv3_7":    "CHORD_EXTENSION__2",     # third inversion 7th explicit

    # ─── Suspended Inversions ───────────────────────
    "sus2/3":    "CHORD_EXTENSION__6(sus2)",
    "sus4/3":    "CHORD_EXTENSION__6(sus4)",
    "sus2/5":    "CHORD_EXTENSION__64(sus2)",
    "sus4/5":    "CHORD_EXTENSION__64(sus4)",

    # ─── Augmented Inversions ───────────────────────
    "aug/3":     "CHORD_EXTENSION__6(+)",
    "aug/5":     "CHORD_EXTENSION__64(+)",
    "+/3":       "CHORD_EXTENSION__6(+)",
    "+/5":       "CHORD_EXTENSION__64(+)",

}

MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11]
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
    keyChords = chords.split("/")
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

    #creates tokens
    tokens = ["CHORD_CHANGE"]
    tokens.append(f"CHORD_DEGREE__{degree}")
    tokens.append(f"TONALITY_DEGREE__{tonalityDegree}")
    tokens.append(f"TONALITY_MODE__{tonalityMode}")
    tokens.append(extensionToken)
    tokens.append("CHORD_OCTAVE__0")

    #returns tokens
    return(tokens)



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

