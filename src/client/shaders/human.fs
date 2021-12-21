#version 300 es

precision highp float;

centroid in vec2 vTexCoord;
in float vBrightness;

uniform highp sampler2D uTexture;

out vec4 outColor;

void main() {
    outColor = vec4(vec3(vBrightness), 1.0) * texture(uTexture, vTexCoord);
}