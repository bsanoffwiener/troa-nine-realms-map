import React from 'react';
import { GPS, SEButton } from '..';
import { ICelestialBody, ISector } from '../../models';

import styles from './Descriptor.module.css';

interface IDescriptorProps {
    celestialBody?: ICelestialBody;
    onZoomOut: () => void;
}

export default class Descriptor extends React.Component<IDescriptorProps> {

    renderPlainList(header: string, list: string[]) {
        if (!list || list.length === 0) {
            return;
        }
        list.sort((a, b) => a.localeCompare(b))
        return (<>
            <div>{header}</div>
            <div>
                {list.join(', ')}
            </div>
        </>);
    }

    renderDeepSpace(sector: ISector) {
        return <div className={styles.wrapper}>
            <div className={styles.title}>{sector.name}</div>
            {sector.description ? <div className={styles.description}>{sector.description}</div> : ''}
            <div className={styles.grid}>
                <div>PvP</div><div>{sector.pve ? 'Not allowed' : 'Allowed'}</div>
                {this.renderPlainList('Ores in asteroids', sector.asteroids.ores)}
            </div>
        </div>
    }

    renderCelestialBody(body: ICelestialBody) {
        return <div className={styles.wrapper}>
            {/* <div className={styles.title}>{planet.name}<br/>{planet.parent.name} sector</div> */}
            <div className={styles.title}>{body.name}</div>
            {/* {planet.spawn ? <div className={styles.spawn}>This is a starter planet of {planet.parent.name} sector</div> : ''} */}
            {body.description ? <div className={styles.description}>{body.description}</div> : ''}
            <div className={styles.grid}>
                <div>PvP</div><div>{body.pve ? 'Not allowed' : 'Allowed'}</div>
                {!body.definition ? '' : <>
                    <div>Gravity</div><div>{body.definition.gravity.toFixed(2)}g</div>
                    <div>Oxygen density</div><div>{body.definition.oxygen_density.toFixed(2)}</div>
                    <div>Atmosphere density</div><div>{body.definition.density.toFixed(2)}</div>
                    {body.definition.max_wind_speed ? <><div>Max wind speed</div><div>{body.definition.max_wind_speed.toFixed(2)} km/h</div></> : ''}
                    {this.renderPlainList('Ores', body.definition.ores)}
                </>
                }
            </div>
            <div className={styles.buttons}>
                <GPS coords={[body.x, body.y, body.z]} name={body.name} color="#ADD8E6" />
                <SEButton label="Zoom out" onClick={this.props.onZoomOut}/>
            </div>
        </div>
    }

    render() {
        const { celestialBody } = this.props;
        if (celestialBody) {
            return this.renderCelestialBody(celestialBody);
        } else {
            return this.renderDeepSpace({
                name: 'Deep Space',
                pve: false,
                asteroids: {
                    ores: ["Everything"]
                },
                x: 0,
                y: 0,
                z: 0,
                planets: [],
                radius: 0,
                color: '#00000'
            });
        }
    }
}
