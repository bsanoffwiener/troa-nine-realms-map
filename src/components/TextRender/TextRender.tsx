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

export enum TextSize {
    Player = "0.02",
    Grid = "0.05",
    Event = "0.05",
    Planet = "0.1"
}

interface ITextProps {
    x: number;
    y: number;
    z: number;
    label: string;
    color?: ReactThreeFiber.Color;
    size?: TextSize;
}

const TextRender: React.FC<ITextProps> = (props: ITextProps) => {

    const font = new THREE.FontLoader().parse(Oxanium);
    // const { camera } = useThree();
    // const v = new THREE.Vector3(props.x, props.y, props.z);

    const textOptions = {
        font: font,
        size: parseFloat(props.size ?? "0.1"),
        height: 0.01
    };

    return <group>
    <mesh
        position={[props.x / scaleDivider, props.y / scaleDivider, props.z / scaleDivider]}
        visible
    >
        <textGeometry attach='geometry' args={[props.label, textOptions]} />
        <meshStandardMaterial attach='material' opacity={props.size ? props.size === TextSize.Planet ? 1.0 : 0.7 : 1.0} color={props.color ?? "white"} transparent={true} />
    </mesh>
</group>
};

export default TextRender;

// export class TextRenderu extends React.Component<ITextProps> {

//     private font = new THREE.FontLoader().parse(Oxanium);

//     render(): JSX.Element {
//         const textOptions = {
//             font: this.font,
//             size: 0.2,
//             height: 0.01
//         };

//         return <group>
//             <mesh
//                 position={[this.props.x / scaleDivider, this.props.y / scaleDivider, this.props.z / scaleDivider]}
//                 visible
//             >
//                 <textGeometry attach='geometry' args={[this.props.label, textOptions]} />
//                 <meshStandardMaterial attach='material' />
//             </mesh>
//         </group>
//     }
// }
