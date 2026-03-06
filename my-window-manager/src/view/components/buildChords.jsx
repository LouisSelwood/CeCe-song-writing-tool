import { ChordBlock } from "../windows/shared-components/blocks/ChordBlock.jsx";
export default function buildChords(store){
    const songSpace = store.state.editor.songSpace;
    const chordObjects = Object.entries(songSpace.objects)
    .filter(([key, value]) => value.type === "chord")
    .map(([key, value]) => ({
        id: key,
        ...value
    }))
    .sort((a, b) => a.startBeat - b.startBeat);

    const chordBlocks = chordObjects.map(chord => (
        <ChordBlock
            key={chord.id}
            store={store}
            chordID={chord.id}
            startBeat={chord.startBeat}
            length={chord.length}
        />
    ));

    return chordBlocks;
}