import { ICelestialBody } from "./ICelestialBody";
import { ICelestialBodyDefinition } from "./IDefinition";
import { IIndex } from "./IIndex";
import { ISector } from "./ISector";

export interface IGalaxy {
    celestial_bodies: ICelestialBody[];
    // pois: ??
    sectors: ISector[];
    index: IIndex[];
    definitions: ICelestialBodyDefinition[];
}
