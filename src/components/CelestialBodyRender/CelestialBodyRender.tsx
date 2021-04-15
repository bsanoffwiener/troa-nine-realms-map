import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";

import { ICelestialBody } from '../../models';
import { setHoverPointer } from "../../helpers/mouse";

interface ICelestialBodyProps {
    body: ICelestialBody;
    isMoon: boolean;
    onSelected: (data: ICelestialBody) => void;
}

const CelestialBodyRender: React.FC<ICelestialBodyProps> = (props: ICelestialBodyProps) => {

    const bodyMesh = useRef<Mesh>();
    const cloudsMesh = useRef<Mesh>();

    const colorMap = useLoader(TextureLoader, props.body.img);
    const cloudMap = useLoader(TextureLoader, `2k_earth_clouds.jpg`);

    useFrame(() => {
        if (bodyMesh.current) bodyMesh.current.rotation.y += 0.001;
        if (cloudsMesh.current) cloudsMesh.current.rotation.y += 0.002;
    });

    return <group>
        <mesh
            ref={bodyMesh}
            position={[props.body.x, props.body.y, props.body.z]}
            visible
            scale={props.body.scale / 3}
            onClick={(event) => { event.stopPropagation(); props.onSelected(props.body)}}
            onPointerOver={(event) => setHoverPointer(true)}
            onPointerOut={(event) => setHoverPointer(false)}
        >
            <sphereBufferGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                attach="material"
                color={props.body.color || 'white'}
                // displacementMap={heightMap}
                // displacementScale={0.05}
                map={colorMap}
            />
        </mesh>
        {props.isMoon ? '' :
        <mesh
            ref={cloudsMesh}
            renderOrder={10}
            position={[props.body.x, props.body.y, props.body.z]}
            visible
            scale={props.body.scale / 2.5}
        >
            <sphereBufferGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                attach="material"
                color={'white'}
                transparent={true}
                opacity={0.3}
                map={cloudMap}
            />
        </mesh>}
    </group>;
}

export default CelestialBodyRender;
