import { Program, Shader, TextureMatrix } from '@pixi/core';
import { Matrix } from '@pixi/math';
import fragment from './shader/mesh.frag';
import vertex from './shader/mesh.vert';

import type { Texture } from '@pixi/core';
import type { Dict } from '@pixi/utils';
import { lightEnvironment, LightEnvironment } from '../LightEnvironment';

export interface IMeshMaterialOptions
{
    alpha?: number;
    tint?: number;
    pluginName?: string;
    program?: Program;
    uniforms?: Dict<unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IlluminatedMeshMaterial extends GlobalMixins.MeshMaterial {}

/**
 * Slightly opinionated default shader for PixiJS 2D objects.
 * @memberof PIXI
 */
export class IlluminatedMeshMaterial extends Shader
{
    /**
     * TextureMatrix instance for this Mesh, used to track Texture changes.
     * @readonly
     */
    public readonly uvMatrix: TextureMatrix;

    /**
     * `true` if shader can be batch with the renderer's batch system.
     * @default true
     */
    public batchable: boolean;

    /**
     * Renderer plugin for batching.
     * @default 'batch'
     */
    public pluginName: string;

    private _lightEnvironment: LightEnvironment;

    /**
     * @param uSampler - Texture that material uses to render.
     * @param options - Additional options
     * @param {number} [options.alpha=1] - Default alpha.
     * @param {number} [options.tint=0xFFFFFF] - Default tint.
     * @param {string} [options.pluginName='batch'] - Renderer plugin for batching.
     * @param {PIXI.Program} [options.program=0xFFFFFF] - Custom program.
     * @param {object} [options.uniforms] - Custom uniforms.
     */
    constructor(texture: Texture, normalMap: Texture, options?: IMeshMaterialOptions)
    {
        const uniforms = {
            uSampler: [texture, normalMap],
            dirLightSrc: new Float32Array([0, 1, 0]),
            dirLight: new Float32Array([0.5, 0.5, 0.5]),
            ambientLight: new Float32Array([0.5, 0.5, 0.5]),
            pointLight1Src: new Float32Array([0, 0, 0]),
            pointLight2Src: new Float32Array([0, 0, 0]),
            pointLight3Src: new Float32Array([0, 0, 0]),
            pointLight4Src: new Float32Array([0, 0, 0]),
            pointLight1: new Float32Array([0.5, 0.5, 0.5]),
            pointLight2: new Float32Array([0.5, 0.5, 0.5]),
            pointLight3: new Float32Array([0.5, 0.5, 0.5]),
            pointLight4: new Float32Array([0.5, 0.5, 0.5]),
            worldScale: 1.0,
            // TODO: remove
            alpha: 1,
            uTextureMatrix: Matrix.IDENTITY,
            uColor: new Float32Array([1, 1, 1, 1]),
        };

        // Set defaults
        options = Object.assign({
            tint: 0xFFFFFF,
            alpha: 1,
            pluginName: 'batchIlluminated',
        }, options);

        if (options.uniforms)
        {
            Object.assign(uniforms, options.uniforms);
        }

        super(options.program || Program.from(vertex, fragment), uniforms);

        this._lightEnvironment = lightEnvironment;

        this.uvMatrix = new TextureMatrix(texture);
        this.batchable = options.program === undefined;
        this.pluginName = options.pluginName;
    }

    /** Reference to the texture being rendered. */
    get texture(): Texture
    {
        return this.uniforms.uSampler[0];
    }
    set texture(value: Texture)
    {
        if (this.uniforms.uSampler[0] !== value)
        {
            this.uniforms.uSampler[0] = value;
            this.uvMatrix.texture = value;
        }
    }

    get normalMap(): Texture
    {
        return this.uniforms.uSampler[1];
    }
    set normalMap(value: Texture)
    {
        if (this.uniforms.uSampler[1] !== value)
        {
            this.uniforms.uSampler[1] = value;
        }
    }

    /** Gets called automatically by the Mesh. Intended to be overridden for custom {@link MeshMaterial} objects. */
    public update(): void
    {
        if (this.uvMatrix.update())
        {
            this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord;
        }

        const uniforms = this.uniforms;

        function normalizeVector(vector) {
            const x = vector[0];
            const y = vector[1];
            const z = vector[2];
            let magnitude = Math.sqrt(x * x + y * y + z * z);

            if (magnitude < 0.00001) {
                vector[0] = 0;
                vector[1] = 0;
                vector[2] = 1;
                return;
            }

            vector[0] = x / magnitude;
            vector[1] = y / magnitude;
            vector[2] = z / magnitude;
        }

        const lightEnvironment = this._lightEnvironment;

        // Ambient light
        const ambientLight = lightEnvironment.ambientLight;
        uniforms.ambientLight[0] =
            (ambientLight.color.r / 255) * ambientLight.luminosity;
        uniforms.ambientLight[1] =
            (ambientLight.color.g / 255) * ambientLight.luminosity;
        uniforms.ambientLight[2] =
            (ambientLight.color.b / 255) * ambientLight.luminosity;

        // if (Math.random() < 0.005) {
        //     console.error('uniforms.ambientLight', ambientLight, uniforms.ambientLight)
        // }

        // Directional light
        const dirLight = lightEnvironment.directionalLight;

        uniforms.dirLightSrc[0] = dirLight.direction.x;
        uniforms.dirLightSrc[1] = dirLight.direction.y;
        uniforms.dirLightSrc[2] = dirLight.direction.z;
        normalizeVector(uniforms.dirLightSrc);

        uniforms.dirLight[0] = (dirLight.color.r / 255) * dirLight.luminosity;
        uniforms.dirLight[1] = (dirLight.color.g / 255) * dirLight.luminosity;
        uniforms.dirLight[2] = (dirLight.color.b / 255) * dirLight.luminosity;

        // Point lights

        // todo: update world transform on time, it seems to be one frame late
        const worldContainer = lightEnvironment.worldContainer;
        const wt = worldContainer.worldTransform;

        const a = wt.a;
        const b = wt.b;
        const c = wt.c;
        const d = wt.d;

        // the world scale is used to scale the point light vectors
        uniforms.worldScale =
        2.0 / (Math.sqrt(a * a + b * b) + Math.sqrt(c * c + d * d));

        const pointLightUniforms = [
            uniforms.pointLight1,
            uniforms.pointLight2,
            uniforms.pointLight3,
            uniforms.pointLight4,
        ];
        const pointLightSrcUniforms = [
            uniforms.pointLight1Src,
            uniforms.pointLight2Src,
            uniforms.pointLight3Src,
            uniforms.pointLight4Src,
        ];

        let i = 0;
        let pointLight = lightEnvironment.getPointLight(i);
        while (pointLight) {
            const pointLightUniform = pointLightUniforms[i];
            pointLightUniform[0] = (pointLight.color.r / 255) * pointLight.luminosity;
            pointLightUniform[1] = (pointLight.color.g / 255) * pointLight.luminosity;
            pointLightUniform[2] = (pointLight.color.b / 255) * pointLight.luminosity;

            const pointLightSrcUniform = pointLightSrcUniforms[i];
            pointLightSrcUniform[0] =
                a * pointLight.position.x + c * pointLight.position.y + wt.tx;
            pointLightSrcUniform[1] =
                b * pointLight.position.x + d * pointLight.position.y + wt.ty;
            pointLightSrcUniform[2] = pointLight.position.z;

            i += 1;
            pointLight = lightEnvironment.getPointLight(i);
        }
    }
}
