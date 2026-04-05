import { SectionBlock } from "../windows/shared-components/blocks/SectionBlock.jsx";
export default function buildSections(store){
    const songSpace = store.state.editor.songSpace;
    const sectionObjects = Object.entries(songSpace.objects)
    .filter(([key, value]) => value.type === "section")
    .map(([key, value]) => ({
        id: key,
        ...value
    }))
    .sort((a, b) => a.startBeat - b.startBeat);

    const sectionBlocks = sectionObjects.map(section => (
        <SectionBlock
            key={section.id}
            store={store}
            sectionID={section.id}
            startBeat={section.startBeat}
            length={section.length}
        />
    ));

    return sectionBlocks;
}