import { Renderer, Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { lightEnvironment, LightEnvironment } from "./LightEnvironment";

export class IlluminatedSprite extends Sprite {

    public _normalMap: Texture;
    public _lightEnvironment: LightEnvironment;
    public transformData: Float32Array;

    constructor(
        texture: Texture,
        normalMap: Texture,
    ) {
        super(texture);

        this._lightEnvironment = lightEnvironment;
        this._normalMap = normalMap;

        this.transformData = new Float32Array(16);
        this.pluginName = 'batchIllumination';
    }

    /**
     *
     * Renders the object using the WebGL renderer
     * @param renderer - The webgl renderer to use.
     */
    protected _render(renderer: Renderer): void {
        this.calculateVertices();

        renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
        renderer.plugins[this.pluginName].render(this);
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

        this.transformData[0] = aInv;
        this.transformData[1] = bInv;
        this.transformData[2] = cInv;
        this.transformData[3] = dInv;

        this.transformData[4] = aInv;
        this.transformData[5] = bInv;
        this.transformData[6] = cInv;
        this.transformData[7] = dInv;

        this.transformData[8] = aInv;
        this.transformData[9] = bInv;
        this.transformData[10] = cInv;
        this.transformData[11] = dInv;

        this.transformData[12] = aInv;
        this.transformData[13] = bInv;
        this.transformData[14] = cInv;
        this.transformData[15] = dInv;
    }
}
