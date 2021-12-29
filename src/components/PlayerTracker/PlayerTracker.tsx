import React from "react";

import { ITrackedPlayer } from '../../models';
import { scaleDivider } from "../../helpers/scale";
import { TextRender } from "..";
import { TextSize } from "../TextRender/TextRender";

interface IPlayerTrackerProps {
    players: ITrackedPlayer[];
}

export default class PlayerTracker extends React.Component<IPlayerTrackerProps> {

   render(): JSX.Element {
        const { players } = this.props;
        return <>
            {players.map(player => <group key={player.Name}>
                <mesh
                    position={[player.X / scaleDivider, player.Y / scaleDivider, player.Z / scaleDivider]}
                    visible
                    scale={0.005}
                >
                    <sphereBufferGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        flatShading={false}
                        attach="material"
                        opacity={0.5}
                        transparent={true}
                        color={"blue"}
                    />
                </mesh>
                <TextRender label={player.Name} x={player.X} y={player.Y} z={player.Z} size={TextSize.Player} color={"blue"} />
                </group>
            )}
        </>
    }
}
