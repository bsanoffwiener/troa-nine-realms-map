import React from "react";

import { GalaxyRender, Loader } from "./components";
import { loadGalaxy } from "./helpers/loader";
import { IGalaxy } from "./models";

import styles from "./App.module.css";

interface IAppState {
    galaxy?: IGalaxy;
}

export default class App extends React.Component<{}, IAppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            galaxy: undefined,
        };
    }

    componentDidMount() {
        this.loadGalaxyData();
    }

    async loadGalaxyData() {
        const galaxy = await loadGalaxy("datav6.json");
        this.setState({ galaxy: galaxy });
        // const t = galaxy.definitions.map(def => {
        //     const o = def.ores.sort((a, b) => a.localeCompare(b));
        //     return `${def.id} ${def.gravity.toFixed(2)}g - ${o.join(', ')}`;
        // });
        // console.log(t.join('\n'));
    }

    render() {
        const { galaxy } = this.state;
        return (
            <>
                {galaxy ? <GalaxyRender galaxy={galaxy} /> : <Loader />}
                <div className={styles.header}>TROA The Nine Realms Map</div>
                <div className={styles.footer}>
                    <a
                        href="https://therealmsofasgard.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <p>Modified by Troa INC</p>
                        <img
                            src="troa-helm.png"
                            alt="Troa INC"
                            className={styles.footer_image}
                        />
                    </a>
                </div>
                {/* <div className={styles.footer}>Created by GThoro</div> */}
            </>
        );
    }
}
