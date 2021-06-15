interface IHierarchyEntry {
    planet: string;
    moons: string[];
}

export interface IIndex {
    name: string;
    hierarchy: IHierarchyEntry[];
}
