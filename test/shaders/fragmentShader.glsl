#version 300 es

precision mediump float;

layout(location = 0) out vec4 color;

in vec2 vTextureCoord;

uniform vec4 uColor;
uniform sampler2D uTexture;

void main() {
	// color = uColor;
	color = texture(uTexture, vTextureCoord);
}
