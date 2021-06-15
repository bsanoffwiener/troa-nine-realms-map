import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { BufferGeometry, Mesh, TextureLoader } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { ICelestialBody } from '../../models';
import { scaleDivider } from "../../helpers/scale";
import TextRender from "../TextRender/TextRender";

interface ICelestialBodyProps {
    body: ICelestialBody;
    onSelected: (data: ICelestialBody) => void;
}

const CelestialBodyRender: React.FC<ICelestialBodyProps> = (props: ICelestialBodyProps) => {

    const bodyMesh = useRef<Mesh>();
    const cloudsMesh = useRef<Mesh>();

    const textureBase = (props.body.definition) ? props.body.definition.id : "Triton";

    const colorMap = useLoader(TextureLoader, `textures/${textureBase}_color.jpg`);
    const heightMap = useLoader(TextureLoader, `textures/${textureBase}.jpg`);
    const cloudMap = useLoader(TextureLoader, `textures/2k_earth_clouds.jpg`);

    const model = useLoader(GLTFLoader, 'CelestialBodyNoSeam.glb');
    const geometry: BufferGeometry = (model.nodes.Cube as any).geometry;

    useFrame(() => {
        if (bodyMesh.current) bodyMesh.current.rotation.y += 0.001;
        if (cloudsMesh.current) cloudsMesh.current.rotation.y += 0.002;
    });

    return <group>
        <mesh
            ref={bodyMesh}
            name="Planet"
            position={[props.body.x / scaleDivider, props.body.y / scaleDivider, props.body.z / scaleDivider]}
            visible
            scale={(props.body.radius / scaleDivider) * 1.1}
            onClick={(event) => { event.stopPropagation(); props.onSelected(props.body)}}
            geometry={geometry}
        >
            {/* <sphereBufferGeometry args={[1, 32, 32]} /> */}
            <meshStandardMaterial
                flatShading={false}
                attach="material"
                displacementMap={heightMap}
                displacementScale={0.05}
                displacementBias={0.0}
                map={colorMap}
            />
        </mesh>
        {props.body.definition && !props.body.definition.has_atmosphere ? '' :
        <mesh
            ref={cloudsMesh}
            name="Clouds"
            renderOrder={10}
            position={[props.body.x / scaleDivider, props.body.y / scaleDivider, props.body.z / scaleDivider]}
            visible
            scale={(props.body.atmosphere_radius / scaleDivider) * 0.8}
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
        <TextRender label={props.body.name} x={props.body.x} y={props.body.y + props.body.atmosphere_radius} z={props.body.z} />
    </group>;
}

export default CelestialBodyRender;
