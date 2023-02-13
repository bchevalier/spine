import { Container } from "@pixi/display";
import { Color } from "..";

class Point3D {
    public x: number;
    public y: number;
    public z: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}

class DirectionalLight {
    public direction: Point3D;
    public color: Color;
    public luminosity: number;

    constructor() {
        this.direction = new Point3D();
        this.color = new Color(255, 255, 255);
        this.luminosity = 1.0;
    }
}

class AmbientLight {
    public color: Color;
    public luminosity: number;

    constructor() {
        this.color = new Color(255, 255, 255);
        this.luminosity = 1.0;
    }
}

class PointLight {
    public position: Point3D;
    public color: Color;
    public luminosity: number;

    constructor() {
        this.position = new Point3D();
        this.color = new Color(255, 255, 255);
        this.luminosity = 1.0;
    }
}

export class LightEnvironment {
    public ambientLight: AmbientLight;
    public directionalLight: DirectionalLight;
    private pointLights: PointLight[];

    public worldContainer: Container;

    constructor() {
        this.worldContainer = null;

        this.ambientLight = new AmbientLight();
        this.directionalLight = new DirectionalLight();
        this.pointLights = [];
    }

    getPointLight(index: number) {
        return this.pointLights[index];
    }

    public addPointLight() {
        if (this.pointLights.length >= 4) {
            console.error('Cannot add more than 4 point lights');
            return null;
        }

        const pointLight = new PointLight();
        this.pointLights.push(pointLight);

        return pointLight;
    }
}

export const lightEnvironment = new LightEnvironment();
