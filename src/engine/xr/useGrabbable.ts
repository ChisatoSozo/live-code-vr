import { AbstractMesh, PointerEventTypes, PointerInfo, TransformNode, WebXRDefaultExperience } from '@babylonjs/core';
import { useEffect } from 'react';
import { useScene } from 'react-babylonjs';

export interface GrabbableMesh extends AbstractMesh {
    grabbable?: boolean;
    grabCallback?: () => void;
}

export interface GrabbableTransform extends TransformNode {
    grabbing?: boolean;
}

export const useGrabbable = (xr: WebXRDefaultExperience | undefined) => {
    const scene = useScene()

    useEffect(() => {
        if (!scene) return;
        if (!xr) return;

        const callback = (pointerInfo: PointerInfo) => {
            if (!pointerInfo) return;
            if (!pointerInfo.pickInfo) return;

            const pointerEvent = pointerInfo.event as PointerEvent
            if (!pointerEvent) return;

            if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh) {
                var pickedMesh = pointerInfo.pickInfo.pickedMesh as GrabbableMesh
                if (!pickedMesh.grabbable || !pickedMesh.parent) return;
                const meshParent = pickedMesh.parent as GrabbableTransform;
                if (!meshParent) return;



                switch (pointerInfo.type) {
                    case PointerEventTypes.POINTERDOWN:
                        if (meshParent.grabbing) return;

                        let xrInput = xr.pointerSelection.getXRControllerByPointerId(pointerEvent.pointerId)
                        let motionController = xrInput?.motionController
                        if (motionController) {
                            meshParent.setParent(motionController.rootMesh)
                        }
                        else {
                            meshParent.setParent(scene.activeCamera)
                        }
                        meshParent.grabbing = true;
                        if (pickedMesh.grabCallback) {
                            pickedMesh.grabCallback();
                        }
                        break;
                    case PointerEventTypes.POINTERUP:
                        // release the object from the parent
                        meshParent.setParent(null)
                        meshParent.grabbing = false;
                        break;
                }
            }
        }
        scene.onPointerObservable.add(callback);

        return () => {
            scene.onPointerObservable.removeCallback(callback);
        }
    }, [scene, xr])
}
