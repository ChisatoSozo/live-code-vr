import React from 'react'
import { FiberStandardMaterialProps, FiberTextureProps } from 'react-babylonjs'
import { useName } from '../hooks/useName'
interface StandardMaterialHelperProps extends FiberStandardMaterialProps {
    prefix: string;
    extension?: string;
    textureProps?: FiberTextureProps
}

export const StandardMaterialHelper: React.FC<StandardMaterialHelperProps> = ({ prefix, extension = "jpg", textureProps = {}, ...props }) => {
    const name = useName("Material")

    return (
        <standardMaterial name={name} specularPower={2}>
            <texture {...textureProps} assignTo="diffuseTexture" url={`${prefix}Color.${extension}`} />
            <texture {...textureProps} assignTo="bumpTexture" url={`${prefix}Normal.${extension}`} />
            <texture {...textureProps} assignTo="ambientTexture" url={`${prefix}AmbientOcclusion.${extension}`} />
            <texture {...textureProps} assignTo="specularTexture" url={`${prefix}Roughness.${extension}`} />
        </standardMaterial>
    )
}
