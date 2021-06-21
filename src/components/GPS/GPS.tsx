import React from 'react';
import { SEButton } from '..';

import styles from './GPS.module.css';

interface IGPSProps {
    name: string;
    coords: number[];
    color: string;
}

interface IGPSState {
    message: string;
    steamOverlayDetected: boolean;
}

export default class GPS extends React.Component<IGPSProps, IGPSState> {

    constructor(props: IGPSProps) {
        super(props);
        this.state = {
            message: '',
            steamOverlayDetected: navigator.userAgent.indexOf("Valve Steam GameOverlay") > 0
        };
    }

    createGPSMaker = (name: string, coords: number[], color: string) => `GPS:${name}:${coords[0]}:${coords[1]}:${coords[2]}:${color}:`;

    handleClick = () => {
        const { name, coords, color } = this.props;
        const gps = this.createGPSMaker(name, coords, color);
        if (!navigator || !navigator.clipboard) {
            this.setState({ message: 'Cannot copy :('});
            setTimeout(() => { this.setState({ message: ''}); }, 1000);
            return;
        }
        navigator.clipboard.writeText(gps);
        this.setState({ message: 'Copied'});
        setTimeout(() => { this.setState({ message: ''}); }, 1000);
    }

    render() {
        const { message, steamOverlayDetected } = this.state;
        if (steamOverlayDetected) {
            return <div className={styles.input}>
                <input
                    type="text"
                    value={this.createGPSMaker(this.props.name, this.props.coords, this.props.color)}
                    onFocus={(e) => e.currentTarget.select()}
                />
            </div>
        }
        return <SEButton label={message ? message : 'Copy GPS to clipboard'} onClick={this.handleClick} />;
    }
}
