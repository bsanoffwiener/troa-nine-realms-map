import React from 'react';
import { ICelestialBody, IEvent, IGalaxy, IIndex, ITrackedGrid, ITrackedPlayer } from '../../models';

import styles from './Index.module.css';

interface IIndexProps {
    galaxy: IGalaxy;
    players: ITrackedPlayer[];
    grids: ITrackedGrid[];
    events: IEvent[];
    onCelestialBodySelected: (data: ICelestialBody) => void;
    onGridSelected: (data: ITrackedGrid) => void;
    onEventSelected: (data: IEvent) => void;
}

export default class Index extends React.Component<IIndexProps> {

    renderList(list: string[]) {
        if (!list || list.length === 0) {
            return <></>;
        }
        list.sort((a, b) => a.localeCompare(b));
        return (<>
            <ul className={styles.list}>
                {list.map(item => <li key={item}>{item}</li>)}
            </ul>
        </>);
    }

    onIndexClick = (name: string) => {
        const celestialBodyClicked = this.props.galaxy.celestial_bodies.find(celestialBody => celestialBody.name === name);
        if (celestialBodyClicked) {
            this.props.onCelestialBodySelected(celestialBodyClicked);
        }
    }

    onGridClick = (grid: ITrackedGrid) => {
        this.props.onGridSelected(grid);
    }

    onEventClick = (event: IEvent) => {
        this.props.onEventSelected(event);
    }

    renderHierarchy(indexEntry: IIndex): JSX.Element {
        if (indexEntry.hierarchy.length === 0) {
            return <></>;
        }

        return (
        <ul>
            {indexEntry.hierarchy.map(hierarchyEntry => {
                if (hierarchyEntry.moons.length === 0) {
                    return <li key={hierarchyEntry.planet}><span onClick={() => this.onIndexClick(hierarchyEntry.planet)}>{hierarchyEntry.planet}</span></li>
                }
                return (<li key={hierarchyEntry.planet}>
                    <span onClick={() => this.onIndexClick(hierarchyEntry.planet)}>{hierarchyEntry.planet}</span>
                    <ul>
                        {hierarchyEntry.moons.map(moon => <li key={moon}><span onClick={() => this.onIndexClick(moon)}>{moon}</span></li>)}
                    </ul>
                </li>)
            })}
        </ul>
        );
    }

    renderIndex(galaxy: IGalaxy) {
        const data = galaxy.index.map(indexEntry => {
            return (
            <li key={indexEntry.name}>
                {indexEntry.name}
                {this.renderHierarchy(indexEntry)}
            </li>);
        });
        // onClick={() => this.props.onCelestialBodySelected(body)}
        // const data = galaxy.celestial_bodies.map(body => {
        //     return <li key={body.name}><span onClick={() => this.props.onCelestialBodySelected(body)}>{body.name}</span></li>;
        // });

        return <>
            <ul className={styles.list}>{data}</ul>
        </>
    }

    renderEvents(events: IEvent[]) {
        if (events.length === 0) {
            return <></>
        }

        return <>
            <div className={styles.title}>Events</div>
            <ul className={styles.list}>
            {events.map(event => {
            return (
                <li key={event.Name}>
                    <span onClick={() => this.onEventClick(event)}>{event.Name}</span>
                </li>);
            })}
            </ul>
        </>
    }

    renderGrids(grids: ITrackedGrid[]) {
        if (grids.length === 0) {
            return <></>
        }

        return <>
            <div className={styles.title}>Grids</div>
            <ul className={styles.list}>
            {grids.map(grid => {
            return (
                <li key={grid.EntityId}>
                    <span onClick={() => this.onGridClick(grid)}>{grid.Name}</span>
                </li>);
            })}
            </ul>
        </>
    }

    renderPlayers(players: ITrackedPlayer[]) {
        if (players.length === 0) {
            return <></>
        }
        players.sort((a, b) => a.Name.localeCompare(b.Name));
        return <>
            <div className={styles.title}>Players</div>
            <ul className={styles.list}>
            {players.map(player => {
            return (
                <li key={player.Name}>
                    {player.Name}
                </li>);
            })}
            </ul>
        </>
    }

    render() {
        const { galaxy, grids, events } = this.props;
        return <div className={styles.wrapper}>
            <div className={styles.title}>Asgard Sector</div>
            {this.renderIndex(galaxy)}
            {this.renderEvents(events)}
            {this.renderGrids(grids)}
            {/* {this.renderPlayers(players)} */}
        </div>;
    }
}
