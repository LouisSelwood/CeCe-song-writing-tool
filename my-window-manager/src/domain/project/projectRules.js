

// Defines the shape and attributes of a project object.
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

    // Domain Behavior

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

    // Project Object -> State Object
    serialize() {
        return {
            name: this.name,
            songContents: [...this.songContents],
            globalKey: this.globalKey,
            metadata: { ...this.metadata },
            filePath: this.filePath,
        };
    }

    // State Object -> Project Object
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

    // Initiates a new, empty project
export function createProject(projectName){
    const project = new Project({name: projectName, filePath: null, globalKey: "C major"});
    return project.serialize();
}

// Adds a section at the end of the song
export function addSectionAtEnd(sectionID, state){
    let project = Project.deserialize(state.project.currentProject)
    project.addSectionAtEnd(sectionID);
    return project.serialize();
}

// Adds a section at a given position of a song
export function addSectionAtPos(sectionID, pos, state){
    let project = Project.deserialize(state.project.currentProject)
    project.addSectionAtPos(sectionID, pos);
    return project.serialize();
}

// Get all the section objects in the song, in order
export function getSections(state){
    const project = Project.deserialize(state.project.currentProject);
    let sections = [];
    project.getSectionIDs().forEach((sectionID) => {
        sections.push(state.sections.byID[sectionID]);
    })
    return sections;
}

// Checks the validity of a given project name
export function validateProjectName(name) {
    if (typeof name !== "string") return false;

    // Trim whitespace
    const trimmed = name.trim();
    if (trimmed.length === 0) return false;

    // Forbidden characters on Windows (and generally unsafe everywhere)
    const forbidden = /[<>:"/\\|?*\x00-\x1F]/;

    if (forbidden.test(trimmed)) return false;

    // Reserved Windows filenames (case-insensitive)
    const reservedNames = [
        "CON", "PRN", "AUX", "NUL",
        "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
        "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"
    ];

    if (reservedNames.includes(trimmed.toUpperCase())) return false;

    // Cannot end with a dot or space (Windows rule)
    if (/[. ]$/.test(trimmed)) return false;

    // Length limit (common safe limit)
    if (trimmed.length > 255) return false;

    return true;
}
