import { ICelestialBodyDefinition } from "./IDefinition";

export interface ICelestialBody {
    name: string;
    definition_id?: string;
    definition?: ICelestialBodyDefinition;
    spawn: boolean;
    pve: boolean;
    pvp: boolean;
    x: number;
    y: number;
    z: number;
    radius: number;
    atmosphere_radius: number;
    description?: string;
}
