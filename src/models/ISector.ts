import { IAsteroids } from "./IAsteroids";
import { ICelestialBody } from "./ICelestialBody";

export interface ISector {
    name: string;
    pve: boolean;
    pvp: boolean;
    planets: ICelestialBody[];
    parent?: ISector;
    asteroids: IAsteroids;
    x: number;
    y: number;
    z: number;
    radius: number;
    color: string;
    description?: string;
}
