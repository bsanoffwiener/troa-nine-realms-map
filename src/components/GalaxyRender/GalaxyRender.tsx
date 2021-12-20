import React, { Suspense, useRef } from "react";
import { Canvas, extend, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3, Intersection } from "three";
import { RootState } from "@react-three/fiber/dist/declarations/src/core/store";

import { ICelestialBody, IGalaxy } from '../../models';
import { CelestialBodyRender, Descriptor, Index, Stars, Zoomer, OreMap } from '..';

import styles from './GalaxyRender.module.css';
import { scaleDivider } from "../../helpers/scale";
import SEButton from "../SEButton/SEButton";

extend({ OrbitControls });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
        }
    }
}

interface IGalaxyRenderProps {
    galaxy: IGalaxy;
}

interface IGalaxyRenderState {
    selectedCelestialBody?: ICelestialBody;
    cameraTargetPos: number[];
    cameraLookAtPos: number[];
    oreMapVisible: boolean;
    indexVisible: boolean;
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

export default class GalaxyRender extends React.Component<IGalaxyRenderProps, IGalaxyRenderState> {

    private defaultCameraPosition = [0, 0, 60];
    private defaultCameraLookAtPosition = [0, 0, 0];

    constructor(props: IGalaxyRenderProps) {
        super(props);
        const urlSearchParams = new URLSearchParams(window.location.search);
        this.state = {
            indexVisible: localStorage ? localStorage.getItem('index_visible') === "true" : true,
            oreMapVisible: urlSearchParams.get('ores') !== null,
            selectedCelestialBody: undefined,
            cameraTargetPos: this.defaultCameraPosition,
            cameraLookAtPos: this.defaultCameraLookAtPosition
        };
    }

    onCelestialBodySelected = (data: ICelestialBody) => {
        this.setState({
            selectedCelestialBody: data,
            cameraTargetPos: [data.x / scaleDivider, data.y / scaleDivider, data.z / scaleDivider + 1],
            cameraLookAtPos: [data.x / scaleDivider, data.y / scaleDivider, data.z / scaleDivider],
        });
    }

    onZoomOutClick = () => {
        this.setState({
            selectedCelestialBody: undefined,
            cameraTargetPos: this.defaultCameraPosition,
            cameraLookAtPos: this.defaultCameraLookAtPosition
        });
    }

    raycasterFilter = (intersects: Intersection[], state: RootState): Intersection[] => {
        // check if planet is hit
        const planetObject = intersects.find(intersection => intersection.object.name === "Planet");
        if (planetObject) {
            return [planetObject];
        }

        // if not, then we do not care anymore
        return intersects;
    }

    onOreMapClose = () => {
        this.setState({ oreMapVisible: false });
    }

    onOreMapOpen = () => {
        this.setState({ oreMapVisible: true });
    }

    onToggleIndex = () => {
        const newVisibleState = !this.state.indexVisible;
        this.setState({indexVisible: newVisibleState});
        if (localStorage) {
            localStorage.setItem('index_visible', newVisibleState ? 'true' : 'false');
        }
    }

    render(): JSX.Element {
        const { galaxy } = this.props;
        const { cameraTargetPos, cameraLookAtPos, oreMapVisible, indexVisible } = this.state;
        return <div className={styles.wrapper}>
            <Canvas
                camera={{ position: [this.defaultCameraPosition[0], this.defaultCameraPosition[1], this.defaultCameraPosition[2]] }}
                onPointerMissed={this.onZoomOutClick}
                raycaster={{ filter: (intersects, state) => this.raycasterFilter(intersects, state) }}
            >
                <ambientLight intensity={0.1} />
                <pointLight position={[0, 0, 40]} intensity={3} />
                <Suspense fallback={null}>
                {galaxy.celestial_bodies.map((body, index) => <CelestialBodyRender
                    key={`${body.name}-${index}`}
                    body={body}
                    onSelected={this.onCelestialBodySelected}
                />)}
                </Suspense>
                <Stars />
                <CameraControls target={cameraLookAtPos}  />
                <Zoomer targetCameraPos={cameraTargetPos} targetLookAtPos={cameraLookAtPos} />
                {/* <PlayerTracker /> */}
            </Canvas>
            <Descriptor
                celestialBody={this.state.selectedCelestialBody}
                onZoomOut={this.onZoomOutClick}
            />
            {oreMapVisible ? <OreMap galaxy={galaxy} onClose={this.onOreMapClose} /> : ''}
            {indexVisible ? <Index
                galaxy={galaxy}
                onCelestialBodySelected={this.onCelestialBodySelected}
            /> : ''}
            <div className={styles.bottompanel}>
                <SEButton label={indexVisible ? "Hide Index" : "Show Index"} onClick={this.onToggleIndex} />
                <SEButton label="Show ore Map" onClick={this.onOreMapOpen} />
            </div>
        </div>
    }
}
