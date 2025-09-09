import React, { Suspense } from "react";
import { Canvas } from '@react-three/fiber';
import { Intersection } from "three";
import { RootState } from "@react-three/fiber/dist/declarations/src/core/store";

import { ICelestialBody, IEvent, IGalaxy, ITrackedGrid, ITrackedPlayer } from '../../models';
import { CelestialBodyRender, Descriptor, Index, Stars, Zoomer, OreMap, PlayerTracker, EventView, CameraControls, EventTracker } from '..';

import styles from './GalaxyRender.module.css';
import { scaleDivider } from "../../helpers/scale";
import SEButton from "../SEButton/SEButton";
import GridTracker from "../GridTracker/GridTracker";

const SGDEvents: IEvent[] = [
    // {
    //     Name: "King of the Hill (Mon-Th)",
    //     X: 194630.01,
    //     Y: 380086.83,
    //     Z: -1393234.82,
    //     CustomData: "Monday - Thursday at GMT 20:00-22:00",
    // },
    // {
    //     Name: "King of the Hill (Fri-Sun)",
    //     X: 782794.61,
    //     Y: 248115.74,
    //     Z: -1082273.34,
    //     CustomData: "Friday - Sunday at GMT 20:00-22:00"
    // }
];

interface IGalaxyRenderProps {
    galaxy: IGalaxy;
}

interface IGalaxyRenderState {
    selectedCelestialBody?: ICelestialBody;
    selectedGrid?: ITrackedGrid;
    selectedEvent?: IEvent;
    cameraTargetPos: number[];
    cameraLookAtPos: number[];
    oreMapVisible: boolean;
    indexVisible: boolean;
    eventView: boolean;
    players: ITrackedPlayer[];
    grids: ITrackedGrid[];
}

export default class GalaxyRender extends React.Component<IGalaxyRenderProps, IGalaxyRenderState> {

    private intervalId?: NodeJS.Timeout;
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
            cameraLookAtPos: this.defaultCameraLookAtPosition,
            players: [],
            grids: [],
            eventView: urlSearchParams.get('event') !== null,
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(() => this.doTick(), 60000);
        this.doTick();
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private async doTick() {
        const response = await fetch('https://setool.therealmsofasgard.com/data/get');
        const data: {
            players: ITrackedPlayer[];
            grids: ITrackedGrid[];
        } = await response.json();
        this.setState(data);
    }

    onCelestialBodySelected = (data: ICelestialBody) => {
        this.setState({
            selectedCelestialBody: data,
            selectedGrid: undefined,
            selectedEvent: undefined,
            cameraTargetPos: [data.x / scaleDivider, data.y / scaleDivider, data.z / scaleDivider + 1],
            cameraLookAtPos: [data.x / scaleDivider, data.y / scaleDivider, data.z / scaleDivider],
        });
    }

    onGridSelected = (data: ITrackedGrid) => {
        this.setState({
            selectedCelestialBody: undefined,
            selectedGrid: data,
            selectedEvent: undefined,
            cameraTargetPos: [data.X / scaleDivider, data.Y / scaleDivider, data.Z / scaleDivider + 1],
            cameraLookAtPos: [data.X / scaleDivider, data.Y / scaleDivider, data.Z / scaleDivider],
        });
    }

    onEventSelected = (data: IEvent) => {
        this.setState({
            selectedCelestialBody: undefined,
            selectedGrid: undefined,
            selectedEvent: data,
            cameraTargetPos: [data.X / scaleDivider, data.Y / scaleDivider, data.Z / scaleDivider + 1],
            cameraLookAtPos: [data.X / scaleDivider, data.Y / scaleDivider, data.Z / scaleDivider],
        });
    }

    onZoomOutClick = () => {
        this.setState({
            selectedCelestialBody: undefined,
            selectedGrid: undefined,
            cameraTargetPos: this.defaultCameraPosition,
            cameraLookAtPos: this.defaultCameraLookAtPosition
        });
    }

    raycasterFilter = (intersects: Intersection[], _state: RootState): Intersection[] => {
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

    onEventView = () => {
        this.setState({ eventView: !this.state.eventView });
    }

    onToggleIndex = () => {
        const newVisibleState = !this.state.indexVisible;
        this.setState({indexVisible: newVisibleState});
        if (localStorage) {
            localStorage.setItem('index_visible', newVisibleState ? 'true' : 'false');
        }
    }

    renderEventView(): JSX.Element {
        return <div className={styles.wrapper}>
            <EventView grids={this.state.grids} players={this.state.players} />
            <div className={styles.bottompanel}>
                <SEButton label="Close Event view" onClick={this.onEventView} />
            </div>
        </div>
    }

    renderGalaxy(): JSX.Element {
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
                <Zoomer targetCameraPos={cameraTargetPos} targetLookAtPos={cameraLookAtPos} />
                <PlayerTracker players={this.state.players} />
                <GridTracker grids={this.state.grids} />
                <EventTracker events={SGDEvents} />
                <CameraControls target={cameraLookAtPos}  />
            </Canvas>
            <Descriptor
                celestialBody={this.state.selectedCelestialBody}
                grid={this.state.selectedGrid}
                event={this.state.selectedEvent}
                onZoomOut={this.onZoomOutClick}
            />
            {oreMapVisible ? <OreMap galaxy={galaxy} onClose={this.onOreMapClose} /> : ''}
            {indexVisible ? <Index
                galaxy={galaxy}
                players={this.state.players}
                grids={this.state.grids}
                events={SGDEvents}
                onCelestialBodySelected={this.onCelestialBodySelected}
                onGridSelected={this.onGridSelected}
                onEventSelected={this.onEventSelected}
            /> : ''}
            <div className={styles.bottompanel}>
                <SEButton label={indexVisible ? "Hide Index" : "Show Index"} onClick={this.onToggleIndex} />
                <SEButton label="Show ore Map" onClick={this.onOreMapOpen} />
                {/* <SEButton label="Event view" onClick={this.onEventView} /> */}
            </div>
        </div>
    }

    render(): JSX.Element {
        const { eventView } = this.state;
        if (eventView) {
            return this.renderEventView();
        }
        return this.renderGalaxy();
    }
}
