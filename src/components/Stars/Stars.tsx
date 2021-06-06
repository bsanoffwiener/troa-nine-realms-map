import React, { useRef, useMemo } from "react";
import { useFrame } from '@react-three/fiber'
import * as THREE from "three";
import { Vector3 } from "three";

const starColors = [
    'lightblue',
    'yellow',
    'red',
    'orange'
];

const Stars: React.FC = (props) => {
    const group = useRef<any>();

    useFrame(() => {
        const theta = new Date().getTime() / 1000000;
        if (group.current) {
            group.current.rotation.set(0, 0, theta)
        }
    });
    const [geo, mat, coords] = useMemo(() => {
        const geom = new THREE.SphereBufferGeometry(0.5, 10, 10);
        // const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.9, 0.0) });
        const mats = new Array(starColors.length).fill([0]).map((v, i) => new THREE.MeshBasicMaterial({ color: new THREE.Color(starColors[i]) }));
        const coord = new Array(2000).fill([0, 0, 0]).map(i => {
            let v: Vector3;
            do {
                v = new Vector3(Math.random() * 1200 - 600, Math.random() * 1200 - 600, Math.random() * 1200 - 600);
            } while (v.length() < 100);
            return [v.x, v.y, v.z];
        });
        return [geom, mats, coord];
    }, []);
    return (
        <group ref={group} scale={1}>
            {coords.map(([p1, p2, p3], i) => (
            <mesh key={i} geometry={geo} material={mat[i % starColors.length]} position={[p1, p2, p3]} />
            ))}
        </group>
    );
}

export default Stars;
