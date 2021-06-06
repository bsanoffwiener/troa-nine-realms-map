export interface ICelestialBodyDefinition {
    id: string;
    ores: string[];
    gravity: number;
    has_atmosphere: boolean;
    breathable: boolean;
    oxygen_density: number;
    density: number;
    max_wind_speed: number;
}
