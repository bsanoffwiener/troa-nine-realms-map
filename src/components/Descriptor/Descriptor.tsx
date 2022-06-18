import React from 'react';
import ReactMarkdown from 'react-markdown'
import { GPS, SEButton } from '..';
import { ICelestialBody, IEvent, ISector, ITrackedGrid } from '../../models';

import styles from './Descriptor.module.css';

interface IDescriptorProps {
    celestialBody?: ICelestialBody;
    grid?: ITrackedGrid;
    event?: IEvent;
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
            {this.renderPlayerEnvironment(sector.pvp, sector.pve)}
            <div className={styles.grid}>
                {/* <div>PvP</div><div>{sector.pve ? 'Not allowed' : 'Allowed'}</div> */}
                {this.renderPlainList('Ores in asteroids', sector.asteroids.ores)}
            </div>
        </div>
    }

    renderValue(label: string, value: any, suffix: string = '', toFixed: boolean = true) {
        if (value === undefined) {
            return <></>;
        }
        return <>
            <div>{label}</div>
            <div>{toFixed ? value.toFixed(2) : value}{suffix}</div>
        </>;
    }

    renderPlayerEnvironment(pvp: boolean, pve: boolean) {
        if (pvp && pve) {
            return <div className={styles.pvpve}>This is a PvPvE area</div>;
        }
        if (pvp) {
            return <div className={styles.pvp}>This is a PvP area</div>;
        }
        return <div className={styles.pve}>This is a PvE area</div>;
    }

    getColorForCelestialBody(pvp: boolean, pve: boolean): string {
        if (pvp && pve) {
            return '#e78d27';
        }
        if (pvp) {
            return '#CC2222';
        }
        return '#22CC22';
    }

    renderCelestialBody(body: ICelestialBody) {
        return <div className={styles.wrapper}>
            {/* <div className={styles.title}>{planet.name}<br/>{planet.parent.name} sector</div> */}
            <div className={styles.title}>{body.name}</div>
            {/* {planet.spawn ? <div className={styles.spawn}>This is a starter planet of {planet.parent.name} sector</div> : ''} */}
            {this.renderPlayerEnvironment(body.pvp, body.pve)}
            {body.description ? <div className={styles.description}>{body.description}</div> : ''}
            <div className={styles.grid}>
                {/* <div>PvP</div><div>{body.pve ? 'Not allowed' : 'Allowed'}</div> */}
                {!body.definition ? '' : <>
                    {this.renderValue('Gravity', body.definition.gravity, 'g')}
                    {this.renderValue('Oxygen density', body.definition.oxygen_density)}
                    {this.renderValue('Atmosphere density', body.definition.density)}
                    {this.renderValue('Max wind speed', body.definition.max_wind_speed, ' km/h')}
                    {this.renderPlainList('Ores', body.definition.ores)}
                </>
                }
            </div>
            <div className={styles.buttons}>
                <GPS coords={[body.x, body.y, body.z]} name={body.name} color={this.getColorForCelestialBody(body.pvp, body.pve)} />
                <SEButton label="Zoom out" onClick={this.props.onZoomOut}/>
            </div>
        </div>
    }

    renderGrid(grid: ITrackedGrid) {
        return <div className={styles.wrapper}>
            <div className={styles.title}>{grid.Name}</div>
            {grid.CustomData ? <ReactMarkdown>{grid.CustomData}</ReactMarkdown> : ''}
            <div className={styles.buttons}>
                <GPS coords={[grid.X, grid.Y, grid.Z]} name={grid.Name} color={"#FFFF00"} />
                <SEButton label="Zoom out" onClick={this.props.onZoomOut}/>
            </div>
        </div>
    }

    renderEvent(event: IEvent) {
        return <div className={styles.wrapper}>
            <div className={styles.title}>{event.Name}</div>
            {event.CustomData ? <ReactMarkdown>{event.CustomData}</ReactMarkdown> : ''}
            <div className={styles.buttons}>
                <GPS coords={[event.X, event.Y, event.Z]} name={event.Name} color={"#75C9F1"} />
                <SEButton label="Zoom out" onClick={this.props.onZoomOut}/>
            </div>
        </div>
    }

    render() {
        const { celestialBody, grid, event } = this.props;
        if (celestialBody) {
            return this.renderCelestialBody(celestialBody);
        } else if (grid) {
            return this.renderGrid(grid);
        } else if (event) {
            return this.renderEvent(event);
        } else {
            return this.renderDeepSpace({
                name: 'Deep Space',
                pve: true,
                pvp: true,
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
