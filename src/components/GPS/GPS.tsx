import React from 'react';
import { SEButton } from '..';

interface IGPSProps {
    name: string;
    coords: number[];
    color: string;
}

interface IGPSState {
    message: string;
}

export default class GPS extends React.Component<IGPSProps, IGPSState> {

    constructor(props: IGPSProps) {
        super(props);
        this.state = {
            message: ''
        };
    }

    handleClick = () => {
        const { name, coords, color } = this.props;
        const gps =  `GPS:${name}:${coords[0]}:${coords[1]}:${coords[2]}:${color}:`;
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
        const { message } = this.state;
        return <SEButton label={message ? message : 'Copy GPS to clipboard'} onClick={this.handleClick} />;
    }
}
