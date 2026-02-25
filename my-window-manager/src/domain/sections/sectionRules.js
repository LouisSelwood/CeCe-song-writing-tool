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
  setSequences(newSequenceIDs){
    this.sequenceIDs = newSequenceIDs;
  }
  addSequence(sequenceID) {
    this.sequenceIDs.push(sequenceID);
  }

  insertSequenceAt(index, sequenceID) {
    this.sequenceIDs.splice(index, 0, sequenceID);
  }

  removeSequence(sequenceID) {
    this.sequenceIDs = this.sequenceIDs.filter(id => id !== sequenceID);
  }

  moveSequence(sequenceID, newIndex) {
    const oldIndex = this.sequenceIDs.indexOf(sequenceID);
    if (oldIndex === -1) return;

    this.sequenceIDs.splice(oldIndex, 1);
    this.sequenceIDs.splice(newIndex, 0, sequenceID);
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

export function createFullSection(type, sequenceIDs){
  const newSection = new SectionSegment({id: generateID(), name: type})
  newSection.setSequences(sequenceIDs);
  return {id: newSection.id, section: newSection.serialize()};
}

export function duplicateSection(state, sectionID){
  const newSection = SectionSegment.deserialize({...state.sections.byID[sectionID], id: generateID()})
  console.log(`domain sequence: ${newSection.getSequenceIDs()}`)
  return {id: newSection.id, section: newSection.serialize(), sequenceIDs: newSection.getSequenceIDs()}
}

export function addSequence(state, sectionID, sequenceID){
  const section = SectionSegment.deserialize(state.sections.byID[sectionID]);
  section.addSequence(sequenceID)
  return section.serialize();
}

export function initiateSequences(state, sectionID, sequenceIDs){
  const section = SectionSegment.deserialize(state.sections.byID[sectionID])
  section.setSequences(sequenceIDs);
  return section.serialize();
}
 