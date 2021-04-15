import { ISector } from "./ISector";

export interface ICelestialBody {
    name: string;
    gravity: number;
    ores: string[];
    spawn: boolean;
    pve_protected: boolean;
    moons: ICelestialBody[];
    parent: ICelestialBody | ISector;
    img: string;
    x: number;
    y: number;
    z: number;
    coords: number[];
    scale: number;
    color?: string;
    has_atmosphere: boolean;
    description?: string;
}
