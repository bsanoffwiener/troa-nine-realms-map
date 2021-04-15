import React from 'react';

import styles from './SEButton.module.css';

interface ISEButton {
    label: string;
    onClick?: () => void;
}

export default class SEButton extends React.Component<ISEButton> {
    render() {
        return <div className={styles.sebutton} onClick={this.props.onClick}>{this.props.label}</div>;
    }
}
