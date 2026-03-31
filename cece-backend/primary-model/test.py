



# -----------------------------
# Test Sequences for Tokeniser
# -----------------------------

tests = {
    "A1": "C major/:C major C major:F major C major:G major C major:",
    "A2": "A minor/:A minor A minor:D minor A minor:E minor A minor:",

    "B1": "C major/:C major C major:D minor C major:G major G major:C major C major:",
    "B2": "C major/:C major C major:A minor A minor:E minor A minor:",
    "B3": "C major/:C major C major:E major E major:B major E major:",

    "C1": "C major/:C major C major:C minor C minor:F minor C minor:C major C major:",
    "C2": "A minor/:A minor A minor:A major A major:E major A major:A minor A minor:",

    "D1": "C major/:D major G major:G major C major:",
    "D2": "C major/:D minor C major:D major G major:G major C major:",
    "D3": "C major/:E minor C major:A major D major:D minor C major:G major C major:",

    "E1": "C major/:Bb major C major:Ab major C major:F minor C major:",
    "E2": "C major/:F minor C major:G major C major:",

    "F1": "C# major/:C# major C# major:F# major C# major:G# major C# major:",
    "F2": "Db major/:Db major Db major:Gb major Db major:Ab major Db major:",
    "F3": "C major/:C major C major:Db major C major:C# minor C major:",

    "G1": "C major/:C major C major:D minor C major:E minor C major:F major C major:G7 C major:A minor C major:D7 C major:G major C major:",

    "H1": "C major/:   D   major   D   major   :   G   7   D   major   :",
    "H2": "c major/:c major c major:f minor c major:g7 c major:",
    "H3": "g major/:  g   MAJOR   g   MAJOR  :B   m7   g   major:   e7   G   MAJOR  :",
}


# ---------------------------------------------------
# Helper to extract global key + mode from DSL header
# ---------------------------------------------------
def parse_global_key(dsl: str):
    header, rest = dsl.split("/:", 1)
    global_key, global_mode = header.split(" ")
    return global_key, global_mode, rest


# -----------------------------
# Run all tests
# -----------------------------
def run_all_tests():
    for name, dsl in tests.items():
        print(f"\n===== {name} =====")

        all_tokens = chords_to_tokens(dsl)

        print(all_tokens)


# Run the test suite
run_all_tests()