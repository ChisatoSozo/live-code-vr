import { VideoTexture } from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core/Maths/math';
import React, { useEffect, useState } from 'react';
import { useScene } from 'react-babylonjs';
import { MediaDevicesExt } from '../types/mediaDevices';

async function startCapture(displayMediaOptions?: MediaStreamConstraints) {
    return (navigator.mediaDevices as MediaDevicesExt).getDisplayMedia(displayMediaOptions);
}

export const Monitor = () => {

    const [mediaTexture, setMediaTexture] = useState<VideoTexture>();
    const scene = useScene()

    useEffect(() => {
        startCapture({
            video: {
                frameRate: 60
            }
        }).then((mediaStream) => {
            const video = document.createElement("VIDEO") as HTMLVideoElement;
            video.setAttribute('id', 'example_video_test');
            video.setAttribute('class', 'video-js js-default-skin');
            video.setAttribute('width', '1706');
            video.setAttribute('data-height', '960');
            video.setAttribute('controls', ' ');
            video.setAttribute('poster', 'http://video-js.zencoder.com/oceans-clip.jpg');
            video.setAttribute('preload', 'auto');
            video.setAttribute('data-setup', '{}');
            video.srcObject = mediaStream
            document.body.appendChild(video);
            setMediaTexture(
                new VideoTexture('UILeftTexture', video, scene)
            );
        })
    }, [scene])

    return mediaTexture ? <plane name="plane" width={1.6} height={.9} position={new Vector3(0, 0, 0)}>
        <standardMaterial
            disableLighting={true}
            useAlphaFromDiffuseTexture
            name="screenMaterial"
            diffuseTexture={mediaTexture}
            emissiveTexture={mediaTexture}
        />
    </plane> : null
}
