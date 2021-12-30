#version 300 es

in vec3 inVertexPos;
in vec3 inVertexColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

out vec3 vertexColor;

void main() {
    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(inVertexPos, 1.0f);
    vertexColor = inVertexColor;
}