NOTE_TO_SEMITONE = {
    "C": 0, "C#": 1, "Db": 1,
    "D": 2, "D#": 3, "Eb": 3,
    "E": 4,
    "F": 5, "F#": 6, "Gb": 6,
    "G": 7, "G#": 8, "Ab": 8,
    "A": 9, "A#": 10, "Bb": 10,
    "B": 11
}

SEMITONE_TO_NOTE = {v: k for k, v in NOTE_TO_SEMITONE.items()}


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

INVERSION_BASS = {
    "6": 3,
    "64": 5,
    "65": 3,
    "43": 5,
    "2": 7,
    "6(sus2)": 3,
    "6(sus4)": 3,
    "64(sus2)": 5,
    "64(sus4)": 5,
    "6(+)": 3,
    "64(+)": 5,
}

EXTENSION_QUALITY = {
    "": "",            # plain triad
    "7": "7",          # seventh chord

    # Inversions of plain triad
    "6": "",
    "64": "",

    # Inversions of seventh chord
    "65": "7",
    "43": "7",
    "2": "7",

    # Suspended
    "(sus2)": "sus2",
    "(sus4)": "sus4",

    # Suspended + inversion
    "6(sus2)": "sus2",
    "6(sus4)": "sus4",
    "64(sus2)": "sus2",
    "64(sus4)": "sus4",

    # Augmented
    "(+)": "aug",
    "6(+)": "aug",
    "64(+)": "aug",
}
