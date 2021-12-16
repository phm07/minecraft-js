#version 300 es

in vec3 inVertexPos;
in vec3 inTexCoord;
in float inBrightness;

uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

out vec3 vTexCoord;
out float vBrightness;
out float vFog;

void main() {
    vec4 eyeSpacePos = uViewMatrix * vec4(inVertexPos, 1.0f);
    gl_Position = uProjMatrix * eyeSpacePos;
    vTexCoord = inTexCoord;
    vBrightness = inBrightness;
    vFog = 1.0 - clamp(exp(-0.005f * abs(eyeSpacePos.z / eyeSpacePos.w)), 0.0f, 1.0f);
}