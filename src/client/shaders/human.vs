#version 300 es

in vec3 inVertexPos;
in vec2 inTexCoord;
in float inBrightness;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

centroid out vec2 vTexCoord;
out float vBrightness;

void main() {
    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(inVertexPos, 1.0f);
    vTexCoord = inTexCoord;
    vBrightness = inBrightness;
}