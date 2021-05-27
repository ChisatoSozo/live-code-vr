import { PhysicsImpostor, Vector3 } from '@babylonjs/core'
import React, { Suspense } from 'react'
import { Model } from 'react-babylonjs'
import { Grabbable } from '../engine/interactions/Grabbable'
import { LiveCodeVR } from '../engine/LiveCodeVR'

export const Scene = () => {
    return (
        <LiveCodeVR>
            <Grabbable grabCallback={() => { }}>
                <sphere name="sphere" diameter={0.4} segments={16} position={new Vector3(0, 2.8, 0)}>
                    <physicsImpostor type={PhysicsImpostor.SphereImpostor} _options={{
                        mass: 1,
                        restitution: 1.5
                    }} />
                </sphere>
            </Grabbable>
            <Suspense fallback={<box name='fallback' position={new Vector3(0, 1.1, 0)} />}>
                <Model name="wriggle" rootUrl={`/wriggle/`} sceneFilename='wriggle.glb' position={new Vector3(0, 1.1, 0)} />
            </Suspense>
        </LiveCodeVR>
    )
}
