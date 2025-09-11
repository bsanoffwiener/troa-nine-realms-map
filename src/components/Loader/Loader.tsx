import React from 'react';

import styles from './Loader.module.css';

export default class Loader extends React.Component {
    render() {
        return <div className={styles.loadercontainer}><div className={styles.loader}>Loading The Realms of Asgard galaxy data, please wait...</div></div>;
    }
}
