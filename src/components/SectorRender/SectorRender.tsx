import React from 'react';
import { ThreeEvent } from '@react-three/fiber/dist/declarations/src/core/events';

import { ICelestialBody, ISector } from '../../models';
import { CelestialBodyRender } from '..';
import { CircleBufferGeometry, Vector3 } from 'three';
import { setHoverPointer } from '../../helpers/mouse';

interface ISectorRenderProps {
    sector: ISector;
    onSectorSelected: (data: ISector) => void;
    onPlanetSelected: (data: ICelestialBody) => void;
    onMoonSelected: (data: ICelestialBody) => void;
}

interface ISectorRenderState {
    hover: boolean;
}

export default class SectorRender extends React.Component<ISectorRenderProps, ISectorRenderState> {

    private circleGeometry: CircleBufferGeometry;

    constructor(props: ISectorRenderProps) {
        super(props);
        this.state = {
            hover: false,
        };
        this.circleGeometry = new CircleBufferGeometry(props.sector.radius, 64);
    }

    onMouseEnter = () => {
        this.setState({ hover: true });
        setHoverPointer(true);
    }

    onMouseLeave = () => {
        this.setState({ hover: false });
        setHoverPointer(false);
    }

    onClickHandler = (event: ThreeEvent<MouseEvent>) => {
        // event.stopPropagation();
        this.props.onSectorSelected(this.props.sector);
    }

    renderSectorSphere(sector: ISector) {
        return <>
            <lineSegments>
                <edgesGeometry attach="geometry" args={[this.circleGeometry]} />
                <lineBasicMaterial attach="material" color={sector.color} opacity={0.2} transparent={true} />
            </lineSegments>
            <mesh
                renderOrder={15}
                onPointerOver={(e) => this.onMouseEnter()}
                onPointerOut={(e) => this.onMouseLeave()}
                onClick={this.onClickHandler}
            >
                {/* {sector.name === "Deep Space" ? <circleBufferGeometry args={[sector.radius, 64]} /> : <sphereBufferGeometry args={[sector.radius, 64, 64]} />} */}
                <circleBufferGeometry args={[sector.radius, 64]} />
                <meshStandardMaterial
                    attach="material"
                    color={sector.color}
                    opacity={0.01}
                    transparent={true}
                />
            </mesh>
        </>
    }

    render(): JSX.Element {
        const { sector } = this.props;
        const pos = new Vector3(sector.x, sector.y, sector.z);
        const celestialBodiesInSector = sector.planets.map(planet => {
            const bodies = planet.moons.map(moon => <CelestialBodyRender key={moon.name} body={moon} onSelected={this.props.onMoonSelected} isMoon={true} />);
            bodies.push(<CelestialBodyRender key={planet.name} body={planet} onSelected={this.props.onPlanetSelected} isMoon={false}/>);
            return bodies;
        });
        return <group position={pos}>
            {sector.name === "Deep Space" ? '' : this.renderSectorSphere(sector)}
            {celestialBodiesInSector}
        </group>
    }
}
