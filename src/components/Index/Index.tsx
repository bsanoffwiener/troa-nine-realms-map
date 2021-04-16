import React from 'react';
import { SEButton } from '..';
import { ICelestialBody, IGalaxy, ISector } from '../../models';

import styles from './Index.module.css';

interface IIndexProps {
    galaxy: IGalaxy;
    onSectorSelected: (data: ISector) => void;
    onPlanetSelected: (data: ICelestialBody) => void;
    onMoonSelected: (data: ICelestialBody) => void;
}

interface IIndexState {
    visible: boolean;
}

export default class Index extends React.Component<IIndexProps, IIndexState> {

    constructor(props: IIndexProps) {
        super(props);
        this.state = {
            visible: localStorage ? localStorage.getItem('index_visible') === "true" : true
        }
    }

    renderList(list: string[]) {
        if (!list || list.length === 0) {
            return;
        }
        return (<>
            <ul className={styles.list}>
                {list.sort((a, b) => a.localeCompare(b)).map(item => <li key={item}>{item}</li>)}
            </ul>
        </>);
    }

    toggleIndex = () => {
        const newVisibleState = !this.state.visible;
        this.setState({visible: newVisibleState});
        if (localStorage) {
            localStorage.setItem('index_visible', newVisibleState ? 'true' : 'false');
        }
    }

    renderIndex(galaxy: IGalaxy) {
        const data = galaxy.sectors.map(sector => {
            if (sector.planets && sector.planets.length > 0) {
                const planets = sector.planets.map(planet => {
                    if (planet.moons && planet.moons.length > 0) {
                        const moons = planet.moons.map(moon => {
                            return <li key={moon.parent.name + moon.name}><span onClick={() => this.props.onMoonSelected(moon)}>{moon.name}</span></li>
                        });
                        return <li key={planet.name}><span onClick={() => this.props.onPlanetSelected(planet)}>{planet.name}</span> <ul className={styles.list}>{moons}</ul></li>;
                    }
                    return <li key={planet.name}><span onClick={() => this.props.onPlanetSelected(planet)}>{planet.name}</span></li>;
                })
                return <li key={sector.name}><span onClick={() => this.props.onSectorSelected(sector)}>{sector.name}</span> <ul className={styles.list}>{planets}</ul></li>;
            }
            return <li key={sector.name}><span onClick={() => this.props.onSectorSelected(sector)}>{sector.name}</span></li>;
        })

        return <>
            <ul className={styles.list}>{data}</ul>
        </>
    }

    render() {
        const { galaxy } = this.props;
        const { visible } = this.state;
        return <div className={styles.wrapper}>
            <div className={styles.title}>Map index</div>
            <SEButton label={visible ? 'Hide' : 'Show'} onClick={this.toggleIndex} />
            {visible ? this.renderIndex(galaxy) : ''}
        </div>;
    }
}
