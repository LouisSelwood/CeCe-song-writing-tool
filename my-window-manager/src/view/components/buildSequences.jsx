import { SequenceBlock } from "../windows/shared-components/blocks/SequenceBlock.jsx";

export default function buildSequences(store, songSpace) {

    // Extract sequence objects
    const sequenceObjects = Object.entries(songSpace.objects)
        .filter(([_, value]) => value.type === "sequence")
        .map(([id, value]) => ({
            id,
            ...value
        }))
        .sort((a, b) => a.startBeat - b.startBeat);

    // Build sequence blocks
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
