import { AbstractMesh, PhysicsImpostor, WebXRDefaultExperience } from '@babylonjs/core';
import "@babylonjs/loaders";
import React, { useEffect, useRef, useState } from 'react';
import { useScene } from 'react-babylonjs';
import { StandardMaterialHelper } from '../helpers/StandardMaterialHelper';
import { useGrabbable } from './useGrabbable';

interface WebXRContainerProps {
    [x: string]: any;
}

interface WebXRContextProps {
    xr: WebXRDefaultExperience | undefined;
}

export const WebXRContext = React.createContext<WebXRContextProps>({
    xr: undefined
});

export const WebXRContainer: React.FC<WebXRContainerProps> = ({ children }) => {
    const scene = useScene();
    const [xr, setXr] = useState<WebXRDefaultExperience>()

    useEffect(() => {
        if (!scene) return;
        const getXR = async () => {
            const xr = await scene.createDefaultXRExperienceAsync({});
            setXr(xr);
        }
        getXR();
    }, [scene])

    const groundRef = useRef<AbstractMesh>();
    useEffect(() => {
        if (!groundRef.current) return;
        if (!xr) return;

        xr.teleportation.addFloorMesh(groundRef.current)
    }, [xr])

    useGrabbable(xr)

    return (
        <WebXRContext.Provider value={{ xr }}>
            {children}
            <ground name="ground" width={100} height={100} subdivisions={2} ref={groundRef}>
                <physicsImpostor type={PhysicsImpostor.BoxImpostor} _options={{
                    mass: 0,
                    restitution: 0.9
                }} />
                <StandardMaterialHelper prefix="/engine/ground/Grass004_2K_" textureProps={{ uScale: 50, vScale: 50 }} />
            </ground>
        </WebXRContext.Provider>
    )
}
