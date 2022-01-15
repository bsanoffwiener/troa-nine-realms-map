import React, { useRef } from "react";
import { extend, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";

extend({ OrbitControls });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
        }
    }
}

interface ICameraControlsProps {
    target: number[];
}

const CameraControls: React.FC<ICameraControlsProps> = (props: ICameraControlsProps) => {
    const { camera, gl: { domElement } } = useThree();
    const controls = useRef<any>();
    const target = new Vector3(props.target[0], props.target[1], props.target[2]);
    useFrame(() => {
        if (controls.current) {
            controls.current.update();
        }
    });
    return <orbitControls ref={controls} args={[camera, domElement]} target={target}  enableDamping={true} />;
};

export default CameraControls;
