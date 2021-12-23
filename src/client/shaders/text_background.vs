#version 300 es

in vec2 inVertexPos;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;
uniform vec3 uCenter;

void main() {

    vec2 vertexPos2d = (uModelMatrix * vec4(inVertexPos, 0.0f, 1.0f)).xy;

    vec3 cameraRight = vec3(uViewMatrix[0][0], uViewMatrix[1][0], uViewMatrix[2][0]);
    vec3 cameraUp = vec3(uViewMatrix[0][1], uViewMatrix[1][1], uViewMatrix[2][1]);
    vec3 vertexPos = uCenter + cameraRight * vertexPos2d.x + cameraUp * vertexPos2d.y;

    gl_Position = uProjMatrix * uViewMatrix * vec4(vertexPos, 1.0f);
}