import { SequenceBlock } from "../windows/shared-components/blocks/SequenceBlock.jsx";
export default function buildSequences(store){
    const songSpace = store.state.editor.songSpace;
    const sequenceObjects = Object.entries(songSpace.objects)
    .filter(([key, value]) => value.type === "sequence")
    .map(([key, value]) => ({
        id: key,
        ...value
    }))
    .sort((a, b) => a.startBeat - b.startBeat);

    const sequenceBlocks = sequenceObjects.map(sequence => (
        <SequenceBlock
            key={sequence.id}
            store={store}
            sequenceID={sequence.id}
            startBeat={sequence.startBeat}
            length={sequence.length}
        />
    ));

    return sequenceBlocks;
}