export class Project {
  constructor({
    name,
    songContents = [],
    globalKey,
    metadata = {},
    filePath,
  }) {
    this.name = name;
    this.songContents = songContents;
    this.globalKey = globalKey;
    this.metadata = metadata;
    this.filePath = filePath;
  }

  getSectionIDs(){
    return this.songContents;
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
      globalKey: this.globalKey,
      metadata: { ...this.metadata },
      filePath: this.filePath,
    };
  }

  static deserialize(data) {
    return new Project({
      name: data.name ?? "Untitled",
      songContents: data.songContents ?? [],
      globalKey: data.globalKey ?? null,
      metadata: data.metadata ?? {},
      filePath: data.filePath ?? null
    });
  }
}

export function createProject(projectName){
  const project = new Project({name: projectName, filePath: null, globalKey: "C major"});
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

export function getSections(state){
  const project = Project.deserialize(state.project.currentProject);
  let sections = [];
  project.getSectionIDs().forEach((sectionID) => {
    sections.push(state.sections.byID[sectionID]);
  })
  return sections;
}