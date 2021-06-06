import { ICelestialBody } from "./ICelestialBody";
import { ICelestialBodyDefinition } from "./IDefinition";
import { ISector } from "./ISector";

export interface IGalaxy {
    celestial_bodies: ICelestialBody[];
    // pois: ??
    sectors: ISector[];
    definitions: ICelestialBodyDefinition[];
}
