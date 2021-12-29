import { ReactThreeFiber } from "@react-three/fiber";
import { ICelestialBody } from "../models";

export const bodyColor = (body: ICelestialBody): ReactThreeFiber.Color => {
    if (body.pve && body.pvp) {
        return "#e78d27";
    }
    if (body.pvp) {
        return "#CC2222";
    }
    return "#22CC22";
}
