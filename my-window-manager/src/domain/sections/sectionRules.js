export class SectionSegment {
  constructor({
    id,
    name = "Section",
    sequenceIDs = [],   // children (ChordSequenceSegment IDs)
    metadata = {},      // optional: tags, AI info, user notes
  }) {
    this.id = id;
    this.name = name;
    this.sequenceIDs = sequenceIDs;
    this.metadata = metadata;
  }

  // --- Domain behaviour ---

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

  // --- Serialization ---

  serialize() {
    return {
      type: "SectionSegment",
      id: this.id,
      name: this.name,
      sequenceIDs: [...this.sequenceIDs],
      metadata: { ...this.metadata },
    };
  }

  static deserialize(data) {
    return new SectionSegment(data);
  }
}

function generateID() {
    return "sect-" + Math.random().toString(36).slice(2);
}

export function createEmptySection(type){
  const newSection = new SectionSegment({id: generateID(), name: type})
  return{id: newSection.id, section: newSection.serialize()};
}

export function addSequenceAtEnd(sectionID, sequenceID, state){
  const section = SectionSegment.deserialize(state.sections.byID[sectionID]);
  section.addSequenceAtEnd(sequenceID);
  return section.serialize()
}

export function addSequenceAtPos(sectionID, sequenceID, pos, state){
  const section = SectionSegment.deserialize(state.sections.byID[sectionID]);
  section.addSequenceAtPos(sequenceID, pos);
  return section.serialize();
}

export function getSequences(sectionID, state){
  const section = SectionSegment.deserialize(state.sections.byID[sectionID]);
  let sequences = [];
  section.getSequenceIDs().forEach((sequenceID) => {
    sequences.push(state.sequences.byID[sequenceID]);
  })
  return sequences;
}

