//#INCLUDE "src/loader.js"
//#INCLUDE "src/Mat3.js"
//#INCLUDE "src/Shader.js"
//#INCLUDE "src/Texture.js"
//#INCLUDE "src/TextureAtlas.js"
//#INCLUDE "src/Material.js"
//#INCLUDE "src/Sprite.js"

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
      shader.bindMaterial = function(mat) {
         // The material should have one texture
         var tex = mat.textures[0];

         // Bind the attribs
         gl.bindBuffer(gl.ARRAY_BUFFER, tex.vertBuffer);
         gl.vertexAttribPointer(this.attrib("aVertPos"), 2, gl.FLOAT, false, 0, 0);

         gl.bindBuffer(gl.ARRAY_BUFFER, tex.coordBuffer);
         gl.vertexAttribPointer(this.attrib("aTexCoord"), 2, gl.FLOAT, false, 0, 0);

         // Bind the texture
         gl.activeTexture(gl.TEXTURE0);
         gl.bindTexture(gl.TEXTURE_2D, tex.tex);
         gl.uniform1i(this.uniform("uTexture"), 0);

         // Cleanup
         gl.bindBuffer(gl.ARRAY_BUFFER, null);
      };
      shader.drawSprite = function(sprite) {
         this.bindMaterial(sprite.mat);

         var mMatrix = sprite.transMatrix.transpose().data;
         gl.uniformMatrix3fv(this.uniform("uModelMatrix"), false, mMatrix);

         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
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

function drawImage(img, x, y) {
   gl.clear(gl.COLOR_BUFFER_BIT);

   var tex = new VIOL.Texture(img);
   var mat = new VIOL.Material(tex);
   var sprite = new VIOL.Sprite(mat, {
      pos: [x, y],
      anch: [0.5, 0.5]
   });

   VIOL.shader.drawSprite(sprite);
}

function atlasTest(img, tileSpec, tx, ty, x, y) {
   gl.clear(gl.COLOR_BUFFER_BIT);

   var atlas = new VIOL.TextureAtlas(img, tileSpec);
   var tex = atlas.getTexture(tx, ty);
   var mat = new VIOL.Material(tex);
   var sprite = new VIOL.Sprite(mat, {
      pos:  [x, y],
      anch: [0.5, 0.5]
   });

   VIOL.shader.drawSprite(sprite);
}
