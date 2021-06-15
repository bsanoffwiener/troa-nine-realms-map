import React from 'react';
import { SEButton } from '..';
import { ICelestialBody, IGalaxy, IIndex } from '../../models';

import styles from './Index.module.css';

interface IIndexProps {
    galaxy: IGalaxy;
    onCelestialBodySelected: (data: ICelestialBody) => void;
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
        list.sort((a, b) => a.localeCompare(b));
        return (<>
            <ul className={styles.list}>
                {list.map(item => <li key={item}>{item}</li>)}
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

    onIndexClick = (name: string) => {
        const celestialBodyClicked = this.props.galaxy.celestial_bodies.find(celestialBody => celestialBody.name === name);
        if (celestialBodyClicked) {
            this.props.onCelestialBodySelected(celestialBodyClicked);
        }
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
