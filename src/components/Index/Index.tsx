import React from 'react';
import { IGalaxy } from '../../models';

import styles from './Index.module.css';

interface IIndexProps {
    galaxy: IGalaxy;
}

export default class Index extends React.Component<IIndexProps> {

    render() {
        const { galaxy } = this.props;
        return <div className={styles.wrapper}>
            {galaxy.sectors.map(sector => <div>{sector.name}</div>)}
        </div>;
    }
}
