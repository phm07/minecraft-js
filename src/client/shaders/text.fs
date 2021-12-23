#version 300 es

precision highp float;

centroid in vec2 vTexCoord;

uniform highp sampler2D uTexture;

out vec4 outColor;

void main() {
    outColor = texture(uTexture, vTexCoord);
    if(outColor.a < 0.5) discard;
}