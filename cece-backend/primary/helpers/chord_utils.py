import primary.helpers.music_theory as theory

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
    if root not in theory.NOTE_TO_SEMITONE:
        raise ValueError(f"Unknown root note: '{root}'")
    if keyRoot not in theory.NOTE_TO_SEMITONE:
        raise ValueError(f"Unknown key root: '{keyRoot}'")
    if quality not in theory.EXTENSION_TOKENS:
        raise ValueError(f"Unknown chord quality: '{quality}'")
    if keyMode not in ("major", "minor"):
        raise ValueError(f"Unknown key mode: '{keyMode}' — must be 'major' or 'minor'")
    if globalKeyRoot not in theory.NOTE_TO_SEMITONE:
        raise ValueError(f"Unknown global key root: '{globalKeyRoot}'")
    if globalKeyMode not in ("major", "minor"):
        raise ValueError(f"Unknown global key mode: '{globalKeyMode}' — must be 'major' or 'minor'")
    
    #Calculate Interval from root
    rootSemi = theory.NOTE_TO_SEMITONE[root]
    keySemi = theory.NOTE_TO_SEMITONE[keyRoot]

    interval = (rootSemi - keySemi) % 12
    if(bass != ""):
        bass_interval = get_bass_interval(root, bass)
        quality += bass_interval
    #Gets Extension Token
    extensionToken = theory.EXTENSION_TOKENS[quality]

    #Gets chord degree and tonality mode
    match keyMode:
        case "major":
            degree = theory.CHROMATIC_DEGREES_MAJOR[interval]
            tonalityMode = "M"
        case "minor":
            degree = theory.CHROMATIC_DEGREES_MINOR[interval]
            tonalityMode = "m"

    # ───────────────────────────────────────────────────────────────
    # MusicLang Tonality Degree:
    # TONALITY_DEGREE = degree of the *local key* relative to the *global key*
    # ───────────────────────────────────────────────────────────────
    globalSemi = theory.NOTE_TO_SEMITONE[globalKeyRoot]
    localSemi = theory.NOTE_TO_SEMITONE[keyRoot]

    tonalityInterval = (localSemi - globalSemi) % 12

    # choose scale based on GLOBAL key mode (MusicLang convention)
    match globalKeyMode:
        case "major":
            tonalityDegree = theory.MAJOR_SCALE.index(tonalityInterval)
        case "minor":
            tonalityDegree = theory.MINOR_SCALE.index(tonalityInterval)

    # Determine base triad quality
    if quality.startswith("m") and not quality.startswith("maj"):
        quality_base = "minor"
    elif quality.startswith("dim") or quality.startswith("o"):
        quality_base = "dim"
    else:
        quality_base = "major"

    # Expected diatonic quality
    degree = chromatic_to_diatonic(degree)
    if keyMode == "major":
        expected_quality = theory.MAJOR_SCALE_QUALITIES[int(degree)]
    else:
        expected_quality = theory.MINOR_SCALE_QUALITIES[int(degree)]

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

    root_semi = theory.NOTE_TO_SEMITONE[root]   # NOTE: square brackets, not parentheses
    bass_semi = theory.NOTE_TO_SEMITONE[bass]

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

def chromatic_to_diatonic(degree: str) -> int:
    # remove accidentals
    if degree.startswith(("b", "#")):
        num = int(degree[1:])
    else:
        num = int(degree)

    # convert to 0-based diatonic index
    return (num - 1) % 7
