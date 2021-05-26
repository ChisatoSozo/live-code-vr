import { DynamicTexture } from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core/Maths/math';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { Grabbable } from '../interactions/Grabbable';
import { MediaDevicesExt } from '../types/mediaDevices';

async function startCapture(displayMediaOptions?: any) {
    return (navigator.mediaDevices as MediaDevicesExt).getDisplayMedia(displayMediaOptions);
}

const monitorPosition = new Vector3(0, 1, 0)


export const Monitor = () => {

    const doneRef = useRef(false);
    const [mediaStream, setMediaStream] = useState<MediaStream>();
    const scene = useScene()
    const mediaTexture = useMemo(() => new DynamicTexture('UILeftTexture', { width: 0, height: 0 }, scene, false), [scene]);
    const reader = useMemo(() => {
        if (!mediaStream) return
        // @ts-ignore
        if (window.MediaStreamTrackProcessor) {
            const track = mediaStream.getVideoTracks()[0];
            // @ts-ignore
            const processor = new window.MediaStreamTrackProcessor(track);
            return processor.readable.getReader();
        }
        else {
            console.error("Your browser doesn't support this API yet, on chrome enable enable-experimental-web-platform-features");
        }
    }, [mediaStream])

    const onGrab = useCallback(() => {
        if (mediaStream) return;
        startCapture({
            video: true
        }).then(setMediaStream)
    }, [mediaStream])

    useEffect(() => {
        const ctx = mediaTexture.getContext()
        const canvas = ctx.canvas;
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fill();
        mediaTexture.update();
    }, [mediaTexture])

    useBeforeRender(() => {
        if (!reader) return;
        if (doneRef.current) return;

        reader.read().then(({ done, value }: { done: boolean; value: any }) => {
            // the MediaStream video can have dynamic size
            if (mediaTexture.getSize().width !== value.displayWidth || mediaTexture.getSize().height !== value.displayHeight) {
                mediaTexture.scaleTo(value.displayWidth, value.displayHeight)
            }
            // value is a VideoFrame
            mediaTexture.getContext().drawImage(value, 0, 0);
            mediaTexture.update();
            value.close(); // close the VideoFrame when we're done with it
            doneRef.current = done;
        });
    })

    return <Grabbable constraints={{ x: true, z: true }} grabCallback={onGrab} position={monitorPosition}>
        <plane name="plane" width={1.6} height={.9}>
            <standardMaterial
                useAlphaFromDiffuseTexture
                name="screenMaterial"
                diffuseTexture={mediaTexture}
                emissiveTexture={mediaTexture}
            />
        </plane>
    </Grabbable>
}
