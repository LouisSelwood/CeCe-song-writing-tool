import { SectionBlock } from "../windows/shared-components/blocks/SectionBlock.jsx";
import { EmptySectionBlock } from "../windows/shared-components/blocks/EmptySectionBlock.jsx";

export default function buildSections(store, songSpace) {
    // Extract section objects
    const sectionObjects = Object.entries(songSpace.objects)
        .filter(([_, value]) => value.type === "section")
        .map(([id, value]) => ({
            id,
            ...value
        }))
        .sort((a, b) => a.startBeat - b.startBeat);

    // Extract empty section objects
    const emptySectionObjects = Object.entries(songSpace.objects)
        .filter(([_, value]) => value.type === "emptySection")
        .map(([id, value]) => ({
            id,
            ...value
        }))
        .sort((a, b) => a.startBeat - b.startBeat);

    // Build actual section blocks
    const sectionBlocks = sectionObjects.map(section => (
        <SectionBlock
            key={section.id}
            store={store}
            sectionID={section.id}
            startBeat={section.startBeat}
            length={section.length}
        />
    ));

    // Build empty section blocks
    const emptyBlocks = emptySectionObjects.map(section => (
        <EmptySectionBlock
            key={section.id}
            store={store}
            sectionID={section.id}
            startBeat={section.startBeat}
            length={section.length}
        />
    ));

    return [...sectionBlocks, ...emptyBlocks];
}
