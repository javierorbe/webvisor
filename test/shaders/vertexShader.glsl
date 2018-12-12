#version 300 es

layout(location = 0) in vec4 aVertexPosition;
layout(location = 1) in vec2 aTextureCoord;

uniform mat4 transformationMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

out vec2 vTextureCoord;

void main() {
	gl_Position = projectionMatrix * viewMatrix * transformationMatrix * aVertexPosition;
	vTextureCoord = aTextureCoord;
}
