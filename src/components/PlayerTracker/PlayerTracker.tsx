import React from "react";
import { extend, ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

import { ITrackedPlayer } from '../../models';
import Oxanium from './Oxanium_Regular.json';
import { scaleDivider } from "../../helpers/scale";

// import styles from './PlayerTracker.module.css';

extend({ Text });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            textRender: ReactThreeFiber.Object3DNode<Text, typeof Text>
        }
    }
}

interface IPlayerTrackerState {
    players: ITrackedPlayer[];
}

export default class PlayerTracker extends React.Component<{}, IPlayerTrackerState> {

    private font = new THREE.FontLoader().parse(Oxanium);
    private intervalId?: NodeJS.Timeout;

    constructor(props: any) {
        super(props);
        this.state = {
            players: []
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(() => this.doTick(), 30000);
        this.doTick();
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private async doTick() {
        const response = await fetch('https://sg-tracker.infcore.net/data/get');
        const data: ITrackedPlayer[] = await response.json();
        this.setState({ players: data });
    }

    render(): JSX.Element {
        const textOptions = {
            font: this.font,
            size: 0.1,
            height: 0.01
        };
        const { players } = this.state;
        return <>
            {players.map(player => <group key={player.Name}>
                <mesh
                    position={[player.X / scaleDivider, player.Y / scaleDivider, player.Z / scaleDivider]}
                    visible
                    scale={0.01}
                >
                    <sphereBufferGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        flatShading={false}
                        attach="material"
                    />
                </mesh>
                <mesh
                    position={[player.X / scaleDivider, player.Y / scaleDivider, player.Z / scaleDivider]}
                    visible
                >
                    <textGeometry attach='geometry' args={[player.Name, textOptions]} />
                    <meshStandardMaterial attach='material' />
                </mesh>
                </group>
            )}
        </>
    }
}
