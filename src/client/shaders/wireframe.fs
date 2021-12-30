#version 300 es

precision highp float;

in vec3 vertexColor;

out vec4 outColor;

void main() {
    outColor = vec4(vertexColor, 1.0);
}