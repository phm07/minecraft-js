#version 300 es

in vec2 inVertexPos;
in vec2 inTexCoord;

out vec2 vTexCoord;

void main() {
    gl_Position = vec4(inVertexPos, 0.0f, 1.0f);
    vTexCoord = inTexCoord;
}