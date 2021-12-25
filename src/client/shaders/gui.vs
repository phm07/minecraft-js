#version 300 es

in vec2 inVertexPos;
in vec2 inTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uProjMatrix;

out vec2 vTexCoord;

void main() {
    gl_Position = uProjMatrix * uModelMatrix * vec4(inVertexPos, 0.0f, 1.0f);
    vTexCoord = inTexCoord;
}