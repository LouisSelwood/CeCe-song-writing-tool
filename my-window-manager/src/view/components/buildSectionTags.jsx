import { SectionTag } from "../windows/shared-components/blocks/SectionTag.jsx";

export default function buildSectionTags(store, songSpace) {

    // Extract section objects
    const sectionObjects = Object.entries(songSpace.objects)
        .filter(([_, value]) => value.type === "section")
        .map(([id, value]) => ({
            id,
            ...value
        }))
        .sort((a, b) => a.startBeat - b.startBeat);

    // Build section tag blocks
    const sectionTags = sectionObjects.map(section => (
        <SectionTag
            key={section.id}
            store={store}
            sectionID={section.id}
            startBeat={section.startBeat}
            length={section.length}
        />
    ));

    return sectionTags;
}
