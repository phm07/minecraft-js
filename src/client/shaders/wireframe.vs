#version 300 es

in vec3 inVertexPos;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

void main() {
    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(inVertexPos, 1.0f);
}