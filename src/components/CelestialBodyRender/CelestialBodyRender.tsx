import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { BufferGeometry, Mesh, TextureLoader } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { ICelestialBody } from '../../models';

interface ICelestialBodyProps {
    body: ICelestialBody;
    onSelected: (data: ICelestialBody) => void;
}

const CelestialBodyRender: React.FC<ICelestialBodyProps> = (props: ICelestialBodyProps) => {

    const bodyMesh = useRef<Mesh>();
    const cloudsMesh = useRef<Mesh>();

    const colorMap = useLoader(TextureLoader, `textures/${props.body.colormap}`);
    const heightMap = useLoader(TextureLoader,  `textures/${props.body.heightmap}`);
    const cloudMap = useLoader(TextureLoader, `textures/2k_earth_clouds.jpg`);

    // const model = useLoader(GLTFLoader, 'CelestialBodyModel.glb');
    const model = useLoader(GLTFLoader, 'CelestialBodyNoSeam.glb');
    const geometry: BufferGeometry = (model.nodes.Cube as any).geometry;
    // var tempGeometry = new Geometry().fromBufferGeometry( geometry );
    // tempGeometry.mergeVertices();
    // tempGeometry.computeVertexNormals();
    // const geom = tempGeometry.toBufferGeometry();

    useFrame(() => {
        if (bodyMesh.current) bodyMesh.current.rotation.y += 0.001;
        if (cloudsMesh.current) cloudsMesh.current.rotation.y += 0.002;
    });

    return <group>
        <mesh
            ref={bodyMesh}
            name="Planet"
            position={[props.body.x, props.body.y, props.body.z]}
            visible
            scale={props.body.scale / 2.5}
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
        {!props.body.has_atmosphere ? '' :
        <mesh
            ref={cloudsMesh}
            name="Clouds"
            renderOrder={10}
            position={[props.body.x, props.body.y, props.body.z]}
            visible
            scale={(props.body.scale / 2.5)}
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
