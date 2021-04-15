import { IAsteroids } from "./IAsteroids";
import { ICelestialBody } from "./ICelestialBody";
import { IGalaxy } from "./IGalaxy";

export interface ISector {
    name: string;
    pve_protected: boolean;
    planets: ICelestialBody[];
    parent: ISector;
    asteroids: IAsteroids;
    x: number;
    y: number;
    z: number;
    radius: number;
    color: string;
    description?: string;
}
