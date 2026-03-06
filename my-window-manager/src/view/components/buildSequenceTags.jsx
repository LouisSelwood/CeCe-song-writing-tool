import { SequenceTag } from "../windows/shared-components/blocks/SequenceTag";
export default function buildSequenceTags(store){
    const songSpace = store.state.editor.songSpace;
    console.log(songSpace.objects)
    const sequenceObjects = Object.entries(songSpace.objects)
    .filter(([key, value]) => value.type === "sequence")
    .map(([key, value]) => ({
        id: key,
        ...value
    }))
    .sort((a, b) => a.startBeat - b.startBeat);

    const sequenceBlocks = sequenceObjects.map(sequence => (
        <SequenceTag
            key={sequence.id}
            store={store}
            sequenceID={sequence.id}
            startBeat={sequence.startBeat}
            length={sequence.length}
        />
    ));

    return sequenceBlocks;
}