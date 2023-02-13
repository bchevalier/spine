import { DRAW_MODES } from '@pixi/constants';
import { State } from '@pixi/core';
import { Mesh } from '@pixi/mesh';
import { IlluminatedMeshGeometry } from './IlluminatedMeshGeometry';
import { IlluminatedMeshMaterial } from './IlluminatedMeshMaterial';

/**
 * The Simple Mesh class mimics Mesh in PixiJS v4, providing easy-to-use constructor arguments.
 * For more robust customization, use {@link PIXI.Mesh}.
 * @memberof PIXI
 */
export class IlluminatedMesh extends Mesh<IlluminatedMeshMaterial>
{
    public invTransformData: Float32Array;
    private invTransformDirty: number;

    constructor(geometry: IlluminatedMeshGeometry, shader: IlluminatedMeshMaterial, state?: State, drawMode: DRAW_MODES = DRAW_MODES.TRIANGLES)
    {
       super(geometry, shader, state, drawMode);

       this.invTransformDirty = 0;
       this.invTransformData = new Float32Array(1);
    }

    calculateVertices() {
        super.calculateVertices();

        const geometry = this.geometry;
        const invTransformBuffer = geometry.buffers[2];
        const vertices = invTransformBuffer.data;

        const invTransformDirtyId = invTransformBuffer._updateID;
        if (invTransformDirtyId === this.invTransformDirty)
        {
            return;
        }

        if (this.invTransformData.length !== vertices.length)
        {
            this.invTransformData = new Float32Array(vertices.length);
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
        for (let i = 0; i < invTransformData.length / 2; i++)
        {
            invTransformData[(i * 2)] = aInv;
            invTransformData[(i * 2) + 1] = bInv;
            invTransformData[(i * 2) + 2] = cInv;
            invTransformData[(i * 2) + 3] = dInv;
        }

        this.invTransformDirty = invTransformDirtyId;
    }
}
