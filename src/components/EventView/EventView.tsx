import { Canvas } from "@react-three/fiber";
import React from "react";
import { CameraControls } from "..";

import { ITrackedGrid, ITrackedPlayer } from '../../models';

import styles from './EventView.module.css';

interface IEventViewProps {
    grids: ITrackedGrid[];
    players: ITrackedPlayer[];
}

interface ICoords {
    X: number;
    Y: number;
    Z: number;
}

const calculateBoundingBox = (items: ICoords[]): [ICoords, ICoords] => {
    if (items.length === 0) {
        return [{ X: 0, Y: 0, Z: 0}, { X: 0, Y: 0, Z: 0}];
    }
    let min: ICoords = { X: items[0].X, Y: items[0].Y, Z: items[0].Z };
    let max: ICoords = { X: items[0].X, Y: items[0].Y, Z: items[0].Z };
    items.forEach(item => {
        if (item.X < min.X) { min.X = item.X; }
        if (item.Y < min.Y) { min.Y = item.Y; }
        if (item.Z < min.Z) { min.Z = item.Z; }
        if (item.X > max.X) { max.X = item.X; }
        if (item.Y > max.Y) { max.Y = item.Y; }
        if (item.Z > max.Z) { max.Z = item.Z; }
    });
    return [min, max];
}

const centerPoint = (min: ICoords, max: ICoords): ICoords => {
    return {
        X: (min.X + max.X) / 2,
        Y: (min.Y + max.Y) / 2,
        Z: (min.Z + max.Z) / 2,
    };
}

const filterPlayersByEvent = (players: ITrackedPlayer[]): ITrackedPlayer[] => players.filter(player => player.Faction?.startsWith("[EVENT]"));

const uniqueFactions = (players: ITrackedPlayer[]) => {
    const factions: string[] = [];
    players.forEach(player => {
        if (player.Faction && factions.indexOf(player.Faction) === -1) {
            factions.push(player.Faction);
        }
    });
    return factions;
};

// const genRandomPlayers = (): ITrackedPlayer[] => {
//     const p: ITrackedPlayer[] = [];
//     for (let index = 0; index < 10; index++) {
//         p.push({
//             Name: `Player #${index+1}`,
//             Faction: Math.random() < 0.5 ? "[EVENT] The Asgards" : "[EVENT] Goa'uld",
//             X: -4383744.888663299 + Math.random() * 10000 - 5000,
//             Y: -1591256.2924943762 + Math.random() * 10000 - 5000,
//             Z: -1587907.5220831707 + Math.random() * 1000 - 500,
//         });
//     }
//     return p;
// }

const factionColor: { [key: string]: string; } = {
    "[EVENT] The Asgards": "#0000FF",
    "[EVENT] The Goa`uld": "#FF0000",
};

const EventView: React.FC<IEventViewProps> = (props) => {
    const scaleDivider = 2000.0;
    const players = filterPlayersByEvent(props.players);
    const { grids } = props;
    //const players = filterPlayersByEvent(genRandomPlayers());
    const factions = uniqueFactions(players);
    const [min, max] = calculateBoundingBox([...players]);
    const center = centerPoint(min, max);
    const camOffset = max.Y / scaleDivider - min.Y / scaleDivider;
    return <>
    <div className={styles.wrapper}>
        {factions.length === 0 ? <div>No players at event right now</div> : <></>}
        {factions.map(faction => <div key={faction} className={styles.faction}>
            {faction.replace("[EVENT]", "")}
            <div className={styles.members}>
                {players.filter(player => player.Faction === faction).map(player => <div key={player.Name}>{player.Name}</div>)}
            </div>
        </div>)}
    </div>
    <Canvas
        camera={{ position: [center.X / scaleDivider, center.Y / scaleDivider, center.Z / scaleDivider + camOffset] }}
    >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={1} />
        <CameraControls target={[center.X / scaleDivider, center.Y / scaleDivider, center.Z / scaleDivider]}  />
        {players.map(player => <group key={player.Name}>
                <mesh
                    position={[player.X / scaleDivider, player.Y / scaleDivider, player.Z / scaleDivider]}
                    visible
                    scale={0.05}
                >
                    <sphereBufferGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        flatShading={false}
                        attach="material"
                        opacity={1}
                        color={factionColor[player.Faction!]}
                    />
                </mesh>
            </group>
        )}
        {grids.map(grid => <group key={grid.EntityId}>
                <mesh
                    position={[grid.X / scaleDivider, grid.Y / scaleDivider, grid.Z / scaleDivider]}
                    visible
                    scale={0.02}
                >
                    <sphereBufferGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        flatShading={false}
                        attach="material"
                        opacity={0.5}
                        color={"white"}
                        transparent={true}
                    />
                </mesh>
            </group>
        )}
    </Canvas>
    </>;
}

export default EventView;
