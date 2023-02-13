attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform mat3 translationMatrix;
uniform mat3 uTextureMatrix;

uniform float worldScale;
uniform vec3 pointLight1Src;
uniform vec3 pointLight2Src;
uniform vec3 pointLight3Src;
uniform vec3 pointLight4Src;

varying vec2 vTextureCoord;

varying vec4 vTransform;
varying vec3 vPointLight1Src;
varying vec3 vPointLight2Src;
varying vec3 vPointLight3Src;
varying vec3 vPointLight4Src;

void main(void)
{
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;

    // heuristic to determine the scale of the sprite
    float scale = 2.0 / (length(aTransform.xy) + length(aTransform.zw));

    vTransform = scale * aTransform;

    vec2 pointLight1Pos = worldScale * vec2(pointLight1Src.x - aVertexPosition.x, aVertexPosition.y - pointLight1Src.y);
    vPointLight1Src = vec3(pointLight1Pos.xy, pointLight1Src.z);

    vec2 pointLight2Pos = worldScale * vec2(pointLight2Src.x - aVertexPosition.x, aVertexPosition.y - pointLight2Src.y);
    vPointLight2Src = vec3(pointLight2Pos.xy, pointLight2Src.z);

    vec2 pointLight3Pos = worldScale * vec2(pointLight3Src.x - aVertexPosition.x, aVertexPosition.y - pointLight3Src.y);
    vPointLight3Src = vec3(pointLight3Pos.xy, pointLight3Src.z);

    vec2 pointLight4Pos = worldScale * vec2(pointLight4Src.x - aVertexPosition.x, aVertexPosition.y - pointLight4Src.y);
    vPointLight4Src = vec3(pointLight4Pos.xy, pointLight4Src.z);
}
