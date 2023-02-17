import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { lightEnvironment, LightEnvironment } from "./LightEnvironment";

export class IlluminatedSprite extends Sprite {

    public _normalMap: Texture;
    public _lightEnvironment: LightEnvironment;
    public invTransformData: Float32Array;
    public normalMultiplierData: Float32Array;

    constructor(
        texture: Texture,
        normalMap: Texture,
    ) {
        super(texture);

        this._lightEnvironment = lightEnvironment;
        this._normalMap = normalMap;

        this.invTransformData = new Float32Array(16);
        this.normalMultiplierData = new Float32Array(4);

        this.pluginName = 'batchIllumination';
    }

    public calculateVertices() {
        super.calculateVertices();

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

        this.invTransformData[0] = aInv;
        this.invTransformData[1] = bInv;
        this.invTransformData[2] = cInv;
        this.invTransformData[3] = dInv;

        this.invTransformData[4] = aInv;
        this.invTransformData[5] = bInv;
        this.invTransformData[6] = cInv;
        this.invTransformData[7] = dInv;

        this.invTransformData[8] = aInv;
        this.invTransformData[9] = bInv;
        this.invTransformData[10] = cInv;
        this.invTransformData[11] = dInv;

        this.invTransformData[12] = aInv;
        this.invTransformData[13] = bInv;
        this.invTransformData[14] = cInv;
        this.invTransformData[15] = dInv;

        this.normalMultiplierData[0] = 1;
        this.normalMultiplierData[1] = 1;
        this.normalMultiplierData[2] = 1;
        this.normalMultiplierData[3] = 1;
    }
}
