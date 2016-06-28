attribute vec2 aVertPos;
attribute vec2 aTextureCoord;

uniform mat3 uViewMatrix;
uniform mat3 uModelMatrix;

varying vec2 vTextureCoord;

void main(void) {
   vTextureCoord = aTextureCoord;
   vec3 homVertPos = vec3(aVertPos, 1.0);
   vec3 trans = uViewMatrix * uModelMatrix * homVertPos;
   gl_Position = vec4(trans.xy, 0.0, 1.0);
}
