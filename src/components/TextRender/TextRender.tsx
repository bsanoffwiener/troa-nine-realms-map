import React from "react";
import { extend, ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

import Oxanium from './Oxanium_Regular.json';
import { scaleDivider } from "../../helpers/scale";

extend({ Text });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            textRender: ReactThreeFiber.Object3DNode<Text, typeof Text>
        }
    }
}

interface ITextProps {
    x: number;
    y: number;
    z: number;
    label: string;
}

export default class TextRender extends React.Component<ITextProps> {

    private font = new THREE.FontLoader().parse(Oxanium);

    render(): JSX.Element {
        const textOptions = {
            font: this.font,
            size: 0.2,
            height: 0.01
        };

        return <group>
            <mesh
                position={[this.props.x / scaleDivider, this.props.y / scaleDivider, this.props.z / scaleDivider]}
                visible
            >
                <textGeometry attach='geometry' args={[this.props.label, textOptions]} />
                <meshStandardMaterial attach='material' />
            </mesh>
        </group>
    }
}
