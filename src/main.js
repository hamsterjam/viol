//#INCLUDE "src/loader.js"
//#INCLUDE "src/Mat3.js"
//#INCLUDE "src/Shader.js"
//#INCLUDE "src/Texture.js"

if (!VIOL) var VIOL = {};
if (!gl) var gl = {};

document.addEventListener('DOMContentLoaded', function() {
   // First we are going to load resources so we can get the config
   VIOL.load("manifest.json", function(res) {
      // I'm not going to go any more layers deep, no callback pyramid today!
      VIOL.res = res;

      // Make the canvas
      var canvas = document.createElement("canvas");
      canvas.width = res.config.width;
      canvas.height = res.config.height;
      document.body.appendChild(canvas);

      // Create our WebGL context
      gl = canvas.getContext("webgl");

      // Make the shader
      var shader = new VIOL.Shader(VIOL.res.vertSrc, VIOL.res.fragSrc, 2);
      shader.enable();

      // Set the view matrix (this is a temporary fixed camera)
      var viewMat = VIOL.Mat3.scale(2/canvas.width, 2/canvas.height);
      viewMat = VIOL.Mat3.translate(-1, -1).mul(viewMat);
      gl.uniformMatrix3fv(shader.uniform("uViewMatrix"), false, viewMat.transpose().data);

      // Set up our display
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Export some stuff
      VIOL.canvas = canvas;
      VIOL.shader = shader;
   });
});

function drawSprite(tex, x, y) {
   // Generate model matrix
   var modelMat = VIOL.Mat3.translate(x, y);
   modelMat = modelMat.aMul(VIOL.Mat3.rotate(Math.PI/4));
   gl.uniformMatrix3fv(VIOL.shader.uniform("uModelMatrix"), false, modelMat.transpose().data);

   // Ask the texture politely to bind the attributes
   tex.bindAttribs(VIOL.shader.attrib("aVertPos"), VIOL.shader.attrib("aTextureCoord"));

   // Bind the texture itself
   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, tex.tex);
   gl.uniform1i(VIOL.shader.uniform("uTexture"), 0);

   // Draw
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

   // Cleanup
   gl.bindTexture(gl.TEXTURE_2D, null);
}
