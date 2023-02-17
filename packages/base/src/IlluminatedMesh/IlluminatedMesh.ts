import { DRAW_MODES } from '@pixi/constants';
import { Renderer, State, Texture } from '@pixi/core';
import { Mesh } from '@pixi/mesh';
import { LightEnvironment } from '../LightEnvironment';
import { IlluminatedMeshGeometry } from './IlluminatedMeshGeometry';
import { IlluminatedMeshMaterial } from './IlluminatedMeshMaterial';

/**
 * The Simple Mesh class mimics Mesh in PixiJS v4, providing easy-to-use constructor arguments.
 * For more robust customization, use {@link PIXI.Mesh}.
 * @memberof PIXI
 */
export class IlluminatedMesh extends Mesh<IlluminatedMeshMaterial>
{
    public _normalMap: Texture;
    public _lightEnvironment: LightEnvironment;

    public invTransformData: Float32Array;
    public normalMultiplierData: Float32Array;

    constructor(geometry: IlluminatedMeshGeometry, shader: IlluminatedMeshMaterial, state?: State, drawMode: DRAW_MODES = DRAW_MODES.TRIANGLES)
    {
       super(geometry, shader, state, drawMode);

       this.invTransformData = new Float32Array(1);
       this.normalMultiplierData = new Float32Array(1);
    }

    _renderToBatch(renderer: Renderer) {
        this._normalMap = this.shader.normalMap;
        this._lightEnvironment = this.shader.lightEnvironment;

        super._renderToBatch(renderer);
    }

    calculateVertices() {
        super.calculateVertices();

        const geometry = this.geometry;

        const invTransformBuffer = geometry.buffers[2];
        const invTransforms = invTransformBuffer.data;
        if (this.invTransformData.length !== invTransforms.length)
        {
            this.invTransformData = new Float32Array(invTransforms.length);
        }

        const wt = this.transform.worldTransform;
        const a = wt.a;
        const b = wt.b;
        const c = wt.c;
        const d = wt.d;

        const detInv = 1 / (a * d - b * c);
        const aInv = detInv * d;
        const bInv = -detInv * b;
        const cInv = -detInv * c;
        const dInv = detInv * a;

        const invTransformData = this.invTransformData;
        for (let i = 0; i < invTransformData.length / 4; i++)
        {
            invTransformData[(i * 4)] = aInv;
            invTransformData[(i * 4) + 1] = bInv;
            invTransformData[(i * 4) + 2] = cInv;
            invTransformData[(i * 4) + 3] = dInv;
        }

        const normalMultiplierBuffer = geometry.buffers[3];
        const normalMultipliers = normalMultiplierBuffer.data;
        if (this.normalMultiplierData.length !== normalMultipliers.length)
        {
            this.normalMultiplierData = new Float32Array(normalMultipliers.length);
        }

        // TODO: check here what should be the multiplier for each vertex!
        const normalMultiplierData = this.normalMultiplierData;
        for (let i = 0; i < normalMultiplierData.length; i++)
        {
            normalMultiplierData[i] = 1;
        }
    }
}
