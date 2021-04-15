import { IGalaxy } from "../models/IGalaxy";

export async function loadGalaxy(url: string): Promise<IGalaxy> {
    let emptyGalaxy: IGalaxy = {
        name: "",
        sectors: [],
    };
    try {
        const response = await fetch(url);
        const data: IGalaxy = await response.json();
        data.sectors.forEach(sector => {
            sector.planets.forEach(planet => {
                planet.pve_protected = planet.pve_protected ?? sector.pve_protected;
                planet.parent = sector;
                planet.moons.forEach(moon => {
                    moon.pve_protected = moon.pve_protected ?? sector.pve_protected
                    moon.parent = planet;
                });
            });
        });
        return data;
    } catch (e) {
        return emptyGalaxy;
    }

}
