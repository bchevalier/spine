varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTransform;
varying vec3 vPointLight1Src;
varying vec3 vPointLight2Src;
varying vec3 vPointLight3Src;
varying vec3 vPointLight4Src;

uniform vec3 dirLightSrc;

uniform vec3 ambientLight;
uniform vec3 dirLight;
uniform vec3 pointLight1;
uniform vec3 pointLight2;
uniform vec3 pointLight3;
uniform vec3 pointLight4;

uniform sampler2D uSampler[2];

void main(void)
{
    vec4 color = texture2D(uSampler[0], vTextureCoord) * uColor;
    vec4 normal = texture2D(uSampler[1], vTextureCoord) * uColor;

    // adding ambient light
    vec3 result = color.rgb * ambientLight;

    // computing normal
    float nx = normal.r - 0.5;
    float ny = normal.g - 0.5;
    vec3 n = vec3(vTransform.x * nx - vTransform.z * ny, -vTransform.y * nx + vTransform.w * ny, normal.b);

    // adding directional light
    float dirLightExposure = max(dot(n, dirLightSrc), 0.0);
    result += color.rgb * dirLight * dirLightExposure;

    // adding point lights
    float pointLight1Dist = length(vPointLight1Src / 1000.0);
    float pointLight1Exposure = max(dot(n, normalize(vPointLight1Src)), 0.0) / pow(pointLight1Dist, 2.0);
    result += color.rgb * pointLight1 * pointLight1Exposure;

    float pointLight2Dist = length(vPointLight2Src / 1000.0);
    float pointLight2Exposure = max(dot(n, normalize(vPointLight2Src)), 0.0) / pow(pointLight2Dist, 2.0);
    result += color.rgb * pointLight2 * pointLight2Exposure;

    float pointLight3Dist = length(vPointLight3Src / 1000.0);
    float pointLight3Exposure = max(dot(n, normalize(vPointLight3Src)), 0.0) / pow(pointLight3Dist, 2.0);
    result += color.rgb * pointLight3 * pointLight3Exposure;

    float pointLight4Dist = length(vPointLight4Src / 1000.0);
    float pointLight4Exposure = max(dot(n, normalize(vPointLight4Src)), 0.0) / pow(pointLight4Dist, 2.0);
    result += color.rgb * pointLight4 * pointLight4Exposure;

    gl_FragColor = vec4(result, color.a);
}
