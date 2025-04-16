let projectMap = {}; // uuid -> Project

class Project {
    constructor(name, emoji) {
        this.name = name;
        this.emoji = emoji;
        this.uuid = crypto.randomUUID();
    }
}

function addProject(name, emoji) {
    const newProj = new Project(name, emoji);
    projectMap[newProj.uuid] = newProj;
    return newProj;
}

function getAllProjs() {
    return Object.values(projectMap);
}

function setProjs(projs) {
    projectMap = {};
    for (const proj of projs) {
        projectMap[proj.uuid] = proj;
    }
}

function getProjByUUID(uuid) {
    return projectMap[uuid] || null;
}

function deleteProjByUUID(uuid) {
    delete projectMap[uuid];
}

export { addProject, getAllProjs, setProjs, getProjByUUID, deleteProjByUUID };
