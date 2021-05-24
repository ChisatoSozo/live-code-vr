
import { Vector3 } from '@babylonjs/core/Maths/math';
import { Scene } from 'react-babylonjs';
import Engine from './forks/Engine.js';
import { useWindowSize } from './hooks/useWindowSize';
import { Monitor } from './workstation/Monitor';

export const LiveCodeVR = () => {
    const windowSize = useWindowSize();

    return (
        <Engine width={windowSize.width} height={windowSize.height} antialias canvasId='babylonJS' >
            <Scene>
                <freeCamera name='camera1' position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]} />
                <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()} />
                <Monitor />
            </Scene>
        </Engine>
    )
}
