import React from 'react';
import { GPS, SEButton } from '..';
import { ICelestialBody, ISector } from '../../models';

import styles from './Descriptor.module.css';

interface IDescriptorProps {
    sector?: ISector;
    planet?: ICelestialBody;
    moon?: ICelestialBody;
    onZoomOut: () => void;
}

export default class Descriptor extends React.Component<IDescriptorProps> {

    renderPlainList(header: string, list: string[]) {
        if (!list || list.length === 0) {
            return;
        }
        return (<>
            <div>{header}</div>
            <div>
                {list.sort((a, b) => a.localeCompare(b)).join(', ')}
            </div>
        </>);
    }

    renderDeepSpace(sector: ISector) {
        return <div className={styles.wrapper}>
            <div className={styles.title}>{sector.name}</div>
            {sector.description ? <div className={styles.description}>{sector.description}</div> : ''}
            <div className={styles.grid}>
                <div>PvP</div><div>{sector.pve_protected ? 'Not allowed' : 'Allowed'}</div>
                {this.renderPlainList('Ores in asteroids', sector.asteroids.ores)}
            </div>
        </div>
    }

    renderSector(sector: ISector) {
        return <div className={styles.wrapper}>
            <div className={styles.title}>{sector.name}</div>
            {sector.description ? <div className={styles.description}>{sector.description}</div> : ''}
            <div className={styles.grid}>
                <div>PvP</div><div>{sector.pve_protected ? 'Not allowed' : 'Allowed'}</div>
                {this.renderPlainList('Planets', sector.planets.map(planet => planet.name))}
                {this.renderPlainList('Ores in asteroids', sector.asteroids.ores)}
            </div>
            <div className={styles.buttons}>
                <SEButton label="Zoom out" onClick={this.props.onZoomOut}/>
            </div>
        </div>
    }

    renderPlanet(planet: ICelestialBody) {
        return <div className={styles.wrapper}>
            {/* <div className={styles.title}>{planet.name}<br/>{planet.parent.name} sector</div> */}
            <div className={styles.title}>{planet.name}</div>
            {planet.spawn ? <div className={styles.spawn}>This is a starter planet of {planet.parent.name} sector</div> : ''}
            {planet.description ? <div className={styles.description}>{planet.description}</div> : ''}
            <div className={styles.grid}>
                <div>PvP</div><div>{planet.pve_protected ? 'Not allowed' : 'Allowed'}</div>
                <div>Gravity</div><div>{planet.gravity.toFixed(2)}g</div>
                {this.renderPlainList('Ores', planet.ores)}
            </div>
            <div className={styles.buttons}>
                <GPS coords={planet.coords} name={planet.name} color="#ADD8E6" />
                <SEButton label="Zoom out" onClick={this.props.onZoomOut}/>
            </div>
        </div>
    }

    renderMoon(moon: ICelestialBody) {
        return <div className={styles.wrapper}>
            <div className={styles.title}>{moon.name}</div>
            <div className={styles.grid}>
                <div>PvP</div><div>{moon.pve_protected ? 'Not allowed' : 'Allowed'}</div>
                <div>Gravity</div><div>{moon.gravity.toFixed(2)}g</div>
                {this.renderPlainList('Ores', moon.ores)}
            </div>
            {moon.description ? <div className={styles.description}>{moon.description}</div> : ''}
            <div className={styles.buttons}>
                <SEButton label="Zoom out" onClick={this.props.onZoomOut}/>
            </div>
        </div>
    }

    render() {
        const { sector, planet, moon } = this.props;
        if (moon) {
            return this.renderMoon(moon);
        } else if (planet) {
            return this.renderPlanet(planet);
        } else if (sector && sector.name === "Deep Space") {
            return this.renderDeepSpace(sector);
        } else if (sector) {
            return this.renderSector(sector);
        }
        return <div></div>;

    }
}
