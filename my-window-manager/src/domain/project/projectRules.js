export class Project {
  constructor({
    name,
    songContents = [],
    metadata = {},
  }) {
    this.name = name;
    this.songContents = songContents;
    this.metadata = metadata;
  }

  moveSection(sectionID, pos) {
    const currentIndex = this.songContents.indexOf(sectionID);
    if (currentIndex === -1) return;

    this.songContents.splice(currentIndex, 1);
    const newPos = Math.max(0, Math.min(pos, this.songContents.length));
    this.songContents.splice(newPos, 0, sectionID);
  }

  addSectionAtEnd(sectionID) {
    this.songContents.push(sectionID);
  }

  addSectionAtPos(sectionID, pos) {
    const newPos = Math.max(0, Math.min(pos, this.songContents.length));
    this.songContents.splice(newPos, 0, sectionID);
  }

  removeSection(sectionID) {
    const index = this.songContents.indexOf(sectionID);
    if (index !== -1) {
      this.songContents.splice(index, 1);
    }
  }

  serialize() {
    return {
      name: this.name,
      songContents: [...this.songContents],
      metadata: { ...this.metadata },
    };
  }

  static deserialize(data) {
    return new Project({
      name: data.name ?? "Untitled",
      songContents: data.songContents ?? [],
      metadata: data.metadata ?? {}
    });
  }
}

export function createProject(projectName){
    const project = new Project({name: projectName});
    return project.serialize();
}
export function addSectionAtEnd(sectionID, state){
    let project = Project.deserialize(state.project.currentProject)
    project.addSectionAtEnd(sectionID);
    return project.serialize();
}
export function addSectionAtPos(sectionID, pos, state){
    let project = Project.deserialize(state.project.currentProject)
    project.addSectionAtPos(sectionID, pos);
    return project.serialize();
}