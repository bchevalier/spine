import { Texture } from '@pixi/core';

import type { ITypedArray, IArrayBuffer, Renderer } from '@pixi/core';
import type { DRAW_MODES } from '@pixi/constants';
import { IlluminatedMesh } from './IlluminatedMesh';
import { IlluminatedMeshMaterial } from './IlluminatedMeshMaterial';
import { IlluminatedMeshGeometry } from './IlluminatedMeshGeometry';

/**
 * The Simple Mesh class mimics Mesh in PixiJS v4, providing easy-to-use constructor arguments.
 * For more robust customization, use {@link PIXI.Mesh}.
 * @memberof PIXI
 */
export class SimpleIlluminatedMesh extends IlluminatedMesh
{
    /** Upload vertices buffer each frame. */
    public autoUpdate: boolean;

    /**
     * @param texture - The texture to use
     * @param {Float32Array} [vertices] - if you want to specify the vertices
     * @param {Float32Array} [uvs] - if you want to specify the uvs
     * @param {Float32Array} [invTransform] - if you want to specify the inverse transform
     * @param {Uint16Array} [indices] - if you want to specify the indices
     * @param drawMode - the drawMode, can be any of the Mesh.DRAW_MODES consts
     */
    constructor(
        texture: Texture = Texture.EMPTY,
        normalMap: Texture = Texture.EMPTY,
        vertices?: IArrayBuffer,
        uvs?: IArrayBuffer,
        invTransform?: IArrayBuffer,
        indices?: IArrayBuffer,
        drawMode?: DRAW_MODES
    )
    {
        const geometry = new IlluminatedMeshGeometry(vertices, uvs, invTransform, indices);

        geometry.getBuffer('aVertexPosition').static = false;

        const meshMaterial = new IlluminatedMeshMaterial(texture, normalMap);

        super(geometry, meshMaterial, undefined, drawMode);

        this.autoUpdate = true;
    }

    /**
     * Collection of vertices data.
     * @type {Float32Array}
     */
    get vertices(): ITypedArray
    {
        return this.geometry.getBuffer('aVertexPosition').data;
    }
    set vertices(value: ITypedArray)
    {
        this.geometry.getBuffer('aVertexPosition').data = value;
    }

    /**
     * Collection of vertices data.
     * @type {Float32Array}
     */
    get invTransform(): ITypedArray
    {
        return this.geometry.getBuffer('aTransform').data;
    }
    set invTransform(value: ITypedArray)
    {
        this.geometry.getBuffer('aTransform').data = value;
    }

    _render(renderer: Renderer): void
    {
        if (this.autoUpdate)
        {
            this.geometry.getBuffer('aVertexPosition').update();
            this.geometry.getBuffer('aTransform').update();
        }

        super._render(renderer);
    }
}
