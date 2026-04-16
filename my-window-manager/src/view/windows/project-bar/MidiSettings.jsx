import "./midiSettings.css";

export function MidiSettings({ onClose, store, state }) {

    const GM_INSTRUMENTS = store.selectors.player.getGMInstruments();
    const RHYTHM_PATTERNS = store.selectors.player.getRhythmPatterns();

    return (
        <div className="midi-settings-window">
            <h3>MIDI Settings</h3>

            <div className="midi-settings-content">

                {/* ⭐ Instrument Selector */}
                <label>Instrument:</label>

                <select
                    className="instrument-select"
                    onChange={(e) => {
                        const [ref, name] = e.target.value.split("::");

                        store.actions.setActiveInstrument({
                            ref,
                            name
                        });
                    }}
                >
                    <option value="">{state.player.currentInstrument}</option>

                    {Object.entries(GM_INSTRUMENTS).map(([family, instruments]) => (
                        <optgroup key={family} label={family}>
                            {instruments.map(inst => (
                                <option 
                                    key={inst.ref} 
                                    value={`${inst.ref}::${inst.name}`}
                                >
                                    {inst.name}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>


                {/* ⭐ Rhythm Selector */}
                <label>Rhythm Pattern:</label>

                <select
                    className="instrument-select"
                    onChange={(e) => {
                        const patternName = e.target.value;
                        store.actions.setRhythm(patternName);
                    }}
                >
                    <option value="">{state.player.currentRhythm}</option>

                    {Object.keys(RHYTHM_PATTERNS).map(patternName => (
                        <option key={patternName} value={patternName}>
                            {patternName}
                        </option>
                    ))}
                </select>

            </div>
        </div>
    );
}
