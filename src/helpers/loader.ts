import { IGalaxy } from "../models/IGalaxy";

export async function loadGalaxy(url: string): Promise<IGalaxy> {
    let emptyGalaxy: IGalaxy = {
        celestial_bodies: [],
        sectors: [],
        definitions: []
    };
    try {
        const response = await fetch(url);
        const data: IGalaxy = await response.json();
        data.celestial_bodies.forEach(body => {
            if (!body.definition_id) {
                return;
            }
            const definition = data.definitions.find(def => def.id === body.definition_id);
            if (definition) {
                body.definition = definition;
            }
        });
        return data;
    } catch (e) {
        return emptyGalaxy;
    }

}
