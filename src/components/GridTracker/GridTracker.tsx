import React from "react";

import { ITrackedGrid } from '../../models';
import { TextRender } from "..";
import { TextSize } from "../TextRender/TextRender";

interface IGridTrackerProps {
    grids: ITrackedGrid[];
}

function clipString(str: string, length: number): string {
    return str.length > length ? str.substring(0, length - 3) + "..." : str;
}

export default class GridTracker extends React.Component<IGridTrackerProps> {

    render(): JSX.Element {
        const { grids } = this.props;

        return <>
            {grids.map(grid => <group key={grid.EntityId}>
                {/* <mesh
                    position={[grid.X / scaleDivider, grid.Y / scaleDivider, grid.Z / scaleDivider]}
                    visible
                    scale={0.01}

                >
                    <sphereBufferGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        flatShading={false}
                        attach="material"
                        color={"yellow"}
                        opacity={0.5}
                        transparent={true}
                    />
                </mesh> */}
                <TextRender label={clipString(grid.Name, 30)} x={grid.X - 10000} y={grid.Y + 10000} z={grid.Z} size={TextSize.Grid} color={"yellow"} />
            </group>
            )}
        </>
    }
}
