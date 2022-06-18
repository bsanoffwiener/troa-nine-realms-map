import React from "react";

import { IEvent } from '../../models';
import { TextRender } from "..";
import { TextSize } from "../TextRender/TextRender";
import { scaleDivider } from "../../helpers/scale";

interface IEventTrackerProps {
    events: IEvent[];
}

function clipString(str: string, length: number): string {
    return str.length > length ? str.substring(0, length - 3) + "..." : str;
}

export default class EventTracker extends React.Component<IEventTrackerProps> {

    render(): JSX.Element {
        const { events } = this.props;

        return <>
            {events.map(event => <group key={event.Name}>
                <mesh
                    position={[event.X / scaleDivider, event.Y / scaleDivider, event.Z / scaleDivider]}
                    visible
                    scale={0.01}
                >
                    <sphereBufferGeometry args={[2, 32, 32]} />
                    <meshStandardMaterial
                        flatShading={false}
                        attach="material"
                        color={"white"}
                        opacity={1}
                        transparent={true}
                    />
                </mesh>
                <TextRender label={clipString(event.Name, 30)} x={event.X - 50000} y={event.Y + 10000} z={event.Z} size={TextSize.Event} color={"white"} />
            </group>
            )}
        </>
    }
}
