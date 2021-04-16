import React from 'react';

import { GalaxyRender } from './components';
import { loadGalaxy } from './helpers/loader';
import { IGalaxy } from './models';

import styles from './App.module.css';

interface IAppState {
    galaxy?: IGalaxy;
}

export default class App extends React.Component<{}, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            galaxy: undefined
        }
    }

    componentDidMount() {
        this.loadGalaxyData();
    }

    async loadGalaxyData() {
        const galaxy = await loadGalaxy('data.json');
        this.setState({ galaxy: galaxy });
    }

    render() {
        const { galaxy } = this.state;
        return <>
            {galaxy ? <GalaxyRender galaxy={galaxy} /> : <div className={styles.loadercontainer}><div className={styles.loader}>Loading galaxy data, please wait...</div></div>}
            <div className={styles.header}>Stargate Dimensions Map</div>
            {/* <div className={styles.footer}>Created by GThoro</div> */}
        </>
    }
}
