import { SectionTag } from "../windows/shared-components/blocks/SectionTag.jsx";
export default function buildSectionTags(store){
    const songSpace = store.state.editor.songSpace;
    const sectionObjects = Object.entries(songSpace.objects)
    .filter(([key, value]) => value.type === "section")
    .map(([key, value]) => ({
        id: key,
        ...value
    }))
    .sort((a, b) => a.startBeat - b.startBeat);

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