import React from 'react';

import { GalaxyRender } from './components';
import { loadGalaxy } from './helpers/loader';
import { IGalaxy } from './models';

interface AppState {
    galaxy?: IGalaxy;
}

export default class App extends React.Component<{}, AppState> {

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
        if (galaxy == null) {
            return <div>Loading...</div>
        }
        return <GalaxyRender galaxy={galaxy} />
    }
}
