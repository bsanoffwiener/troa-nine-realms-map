import React, { Suspense, useRef } from "react";
import { Canvas, extend, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3, Intersection } from "three";
import { RootState } from "@react-three/fiber/dist/declarations/src/core/store";

import { ICelestialBody, IGalaxy, ISector } from '../../models';
import { Descriptor, Index, SectorRender, Stars, Zoomer } from '..';

import styles from './GalaxyRender.module.css';

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
    selectedSector?: ISector;
    selectedPlanet?: ICelestialBody;
    selectedMoon?: ICelestialBody;
    cameraTargetPos: number[];
    cameraLookAtPos: number[];
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
        const deepSpace = this.props.galaxy.sectors.find(sector => sector.name === "Deep Space");
        this.state = {
            selectedSector: deepSpace,
            selectedPlanet: undefined,
            selectedMoon: undefined,
            cameraTargetPos: this.defaultCameraPosition,
            cameraLookAtPos: this.defaultCameraLookAtPosition
        };
    }

    onSectorSelected = (data: ISector) => {
        this.setState({
            selectedSector: data,
            selectedPlanet: undefined,
            selectedMoon: undefined
        });

        this.setState({
            cameraTargetPos: [data.x, data.y, data.z + data.radius * 1.5],
            cameraLookAtPos: [data.x, data.y, data.z]
        });

    }

    onPlanetSelected = (data: ICelestialBody) => {
        this.setState({
            selectedSector: undefined,
            selectedPlanet: data,
            selectedMoon: undefined,
            cameraTargetPos: [data.x + data.parent.x, data.y + data.parent.y, data.z + data.parent.z + data.scale * 1],
            cameraLookAtPos: [data.x + data.parent.x, data.y + data.parent.y, data.z + data.parent.z],
        });
    }

    onMoonSelected = (data: ICelestialBody) => {
        this.setState({
            selectedSector: undefined,
            selectedPlanet: undefined,
            selectedMoon: data,
            cameraTargetPos: [data.x + data.parent.parent.x, data.y + data.parent.parent.y, data.z + data.parent.parent.z + data.scale * 1],
            cameraLookAtPos: [data.x + data.parent.parent.x, data.y + data.parent.parent.y, data.z + data.parent.parent.z],
        });
    }

    onZoomOutClick = () => {
        const { selectedPlanet, selectedMoon } = this.state;
        if (selectedMoon) {
            this.onSectorSelected(selectedMoon.parent.parent as ISector);
            return;
        }

        if (selectedPlanet) {
            this.onSectorSelected(selectedPlanet.parent as ISector);
            return;
        }

        const deepSpace = this.props.galaxy.sectors.find(sector => sector.name === "Deep Space");
        if (deepSpace) {
            this.onSectorSelected(deepSpace);
            return;
        }
    }

    selectDefaultSector = () => {
        const deepSpace = this.props.galaxy.sectors.find(sector => sector.name === "Deep Space");
        this.setState({
            selectedSector: deepSpace,
            selectedPlanet: undefined,
            selectedMoon: undefined,
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

    render(): JSX.Element {
        const { galaxy } = this.props;
        const { cameraTargetPos, cameraLookAtPos } = this.state;
        return <div className={styles.wrapper}>
            <Canvas
                camera={{ position: [this.defaultCameraPosition[0], this.defaultCameraPosition[1], this.defaultCameraPosition[2]] }}
                onPointerMissed={this.selectDefaultSector}
                raycaster={{ filter: (intersects, state) => this.raycasterFilter(intersects, state) }}
            >
                <ambientLight intensity={0.1} />
                <pointLight position={[0, 0, 40]} />
                <Suspense fallback={null}>
                {galaxy.sectors.map(sector => <SectorRender
                    key={sector.name}
                    sector={sector}
                    onPlanetSelected={this.onPlanetSelected}
                    onSectorSelected={this.onSectorSelected}
                    onMoonSelected={this.onMoonSelected}
                />)}
                </Suspense>
                <Stars />
                <CameraControls target={cameraLookAtPos}  />
                <Zoomer targetCameraPos={cameraTargetPos} targetLookAtPos={cameraLookAtPos} />
            </Canvas>
            <Descriptor
                sector={this.state.selectedSector}
                planet={this.state.selectedPlanet}
                moon={this.state.selectedMoon}
                onZoomOut={this.onZoomOutClick}
            />
            <Index
                galaxy={galaxy}
                onPlanetSelected={this.onPlanetSelected}
                onSectorSelected={this.onSectorSelected}
                onMoonSelected={this.onMoonSelected}
            />
        </div>
    }
}
