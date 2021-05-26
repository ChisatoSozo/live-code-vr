import React, { useEffect, useRef } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { useName } from '../hooks/useName';
import { GrabbableMesh, GrabbableTransform } from '../xr/useGrabbable';

interface GrabbableProps {
    constraints?: {
        x?: boolean,
        y?: boolean,
        z?: boolean
    };
    grabCallback: () => void;
    [x: string]: any;
}

export const Grabbable: React.FC<GrabbableProps> = ({ children, constraints, grabCallback, ...props }) => {
    const name = useName("Grabbable")
    const scene = useScene()
    const transformNodeRef = useRef<GrabbableTransform>();

    useEffect(() => {
        if (!transformNodeRef.current) return;
        transformNodeRef.current.getChildMeshes(true).forEach(mesh => {
            const grabbableMesh = mesh as GrabbableMesh;
            grabbableMesh.grabbable = true;
            grabbableMesh.grabCallback = grabCallback;
        })
    }, [constraints, grabCallback, name, scene])

    useBeforeRender(() => {
        if (!constraints) return;
        if (!transformNodeRef.current) return;
        if (transformNodeRef.current.grabbing) return;
        if (transformNodeRef.current.rotation.x && constraints.x) transformNodeRef.current.rotation.x = 0;
        if (transformNodeRef.current.rotation.y && constraints.y) transformNodeRef.current.rotation.y = 0;
        if (transformNodeRef.current.rotation.z && constraints.z) transformNodeRef.current.rotation.z = 0;
    })

    return <transformNode name={name} ref={transformNodeRef} {...props}>
        {children}
    </transformNode>
}
