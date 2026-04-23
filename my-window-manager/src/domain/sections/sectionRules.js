// Defines the shape and attributes of a Section Object
export class SectionSegment {
    constructor({
        id,                 // Unique ID
        name = "Section",   // Name/Type of setion
        sequenceIDs = [],   // An array of ordered sequence IDs representing the contents of the section
        metadata = {},     
    }) {
        this.id = id;
        this.name = name;
        this.sequenceIDs = sequenceIDs;
        this.metadata = metadata;
    }

    // Domain Behaviour 
    generateNewID(){
        this.id = "sect-" + Math.random().toString(36).slice(2);
    }
    emptySequence(){
        this.sequenceIDs = [];
    }
    getSequenceIDs(){
        return this.sequenceIDs;
    }
    moveSequence(sequenceID, pos) {
        const currentIndex = this.sequenceIDs.indexOf(sequenceID);
        if (currentIndex === -1) return;

        this.sequenceIDs.splice(currentIndex, 1);
        const newPos = Math.max(0, Math.min(pos, this.sequenceIDs.length));
        this.sequenceIDs.splice(newPos, 0, sequenceID);
    }

    addSequenceAtEnd(sequenceID) {
        this.sequenceIDs.push(sequenceID);
    }

    addSequenceAtPos(sequenceID, pos) {
        const newPos = Math.max(0, Math.min(pos, this.sequenceIDs.length));
        this.sequenceIDs.splice(newPos, 0, sequenceID);
    }

    removeSequence(sequenceID) {
        const index = this.sequenceIDs.indexOf(sequenceID);
        if (index !== -1) {
            this.sequenceIDs.splice(index, 1);
        }
    }

    rename(newName) {
        this.name = newName;
    }

    // Section Object -> State object
    serialize() {
        return {
            type: "SectionSegment",
            id: this.id,
            name: this.name,
            sequenceIDs: [...this.sequenceIDs],
            metadata: { ...this.metadata },
        };
    }

    // State object -> Section Object
    static deserialize(data) {
        return new SectionSegment(data);
    }
}

function generateID() {
    return "sect-" + Math.random().toString(36).slice(2);
}

// Creates an empty, titled section
export function createEmptySection(type){
    const newSection = new SectionSegment({id: generateID(), name: type})
    return newSection.serialize();
}

// Duplicates a given section object, and returns an empty compy
export function duplicateSection(sectionObj){
    const newSection = SectionSegment.deserialize(sectionObj)
    newSection.generateNewID();
    newSection.emptySequence();
    return newSection.serialize();
}

// Adds a given sequence at the end of a given section
export function addSequenceAtEnd(sectionObj, sequenceID){
    const section = SectionSegment.deserialize(sectionObj);
    section.addSequenceAtEnd(sequenceID);
    return section.serialize()
}

// Adds a sequence to a given section at a given position
export function addSequenceAtPos(sectionID, sequenceID, pos, state){
    const section = SectionSegment.deserialize(state.sections.byID[sectionID]);
    section.addSequenceAtPos(sequenceID, pos);
    return section.serialize();
}

// Gets all sequence objects inside a given section
export function getSequences(sectionID, state){
    const section = SectionSegment.deserialize(state.sections.byID[sectionID]);
    let sequences = [];
    section.getSequenceIDs().forEach((sequenceID) => {
        sequences.push(state.sequences.byID[sequenceID]);
    })
return sequences;
}





