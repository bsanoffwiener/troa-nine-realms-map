import React from "react";
import { useFrame } from '@react-three/fiber'
import { useSpring } from "@react-spring/core";

interface IZoomerProps {
    targetCameraPos: number[];
    targetLookAtPos: number[];
}

const Zoomer: React.FC<IZoomerProps> = (props: IZoomerProps) => {

    // const { camera } = useThree();

    const { tcx, tcy, tcz, tlx, tly, tlz } = useSpring({
        // cancel: false,
        // from: {
        //     tcx: camera.position.x,
        //     tcy: camera.position.y,
        //     tcz: camera.position.z,
        //     // tlx: camera.tar,
        //     // tly: props.targetLookAtPos[1],
        //     // tlz: props.targetLookAtPos[2]
        // },
        to: {
            tcx: props.targetCameraPos[0],
            tcy: props.targetCameraPos[1],
            tcz: props.targetCameraPos[2],
            tlx: props.targetLookAtPos[0],
            tly: props.targetLookAtPos[1],
            tlz: props.targetLookAtPos[2]
        },
        config: { mass: 10, tension: 1000, friction: 300, precision: 0.001, duration: 500.0 }
    });

    useFrame(state => {
        if (tcx.isAnimating || tcy.isAnimating || tcz.isAnimating || tlx.isAnimating || tly.isAnimating || tlz.isAnimating) {
            state.camera.position.x = tcx.get();
            state.camera.position.y = tcy.get();
            state.camera.position.z = tcz.get();
            // state.camera.lookAt(tlx.get(), tly.get(), tlz.get());
            state.camera.updateProjectionMatrix();
        }
    });
    return null;
}

export default Zoomer;
