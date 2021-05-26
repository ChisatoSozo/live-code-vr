
import { CannonJSPlugin, Texture } from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core/Maths/math';
import * as CANNON from 'cannon';
import React from 'react';
import { Scene } from 'react-babylonjs';
import Engine from './forks/Engine.js';
import { useWindowSize } from './hooks/useWindowSize';
import { Monitor } from './workstation/Monitor';
import { WebXRContainer } from './xr/WebXRContainer';
window.CANNON = CANNON;
const gravityVector = new Vector3(0, -9.81, 0);

export const LiveCodeVR: React.FC = ({ children }) => {
    const windowSize = useWindowSize();

    return (
        <Engine width={windowSize.width} height={windowSize.height} antialias canvasId='babylonJS' >
            <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
                <WebXRContainer>
                    <freeCamera name='camera1' position={new Vector3(0, 1, -1)} setTarget={[Vector3.Zero()]} minZ={0.01} />
                    <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()} />
                    <box name="skybox" size={1000.0}>
                        <standardMaterial name="skyboxMaterial" backFaceCulling={false} disableLighting={true}>
                            <cubeTexture rootUrl="/engine/sky/" forcedExtension=".png" assignTo="reflectionTexture" coordinatesMode={Texture.SKYBOX_MODE} name="skyboxTexture" />
                        </standardMaterial>
                    </box>
                    <Monitor />
                    {children}
                </WebXRContainer>
            </Scene>
        </Engine>
    )
}


