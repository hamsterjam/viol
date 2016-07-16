//#IFNDEF __HAMSTERJAM_VIOL_TEXTURE_ATLAS
//#DEFINE __HAMSTERJAM_VIOL_TEXTURE_ATLAS

//#INCLUDE "src/Texture.js"

if (!VIOL) VIOL = {};

(function() {
   function TextureAtlas(img, tileSpec) {
      // Default values

      // For future reference:
      //    size:    This is the dimensions of 1 tile
      //    pad:     This is the gap between tiles
      //    count:   This is how many tiles exist (in x and y)

      if (!(tileSpec.size  instanceof Array)) tileSpec.size  = [tileSpec.size,  tileSpec.size];
      if (!(tileSpec.pad   instanceof Array)) tileSpec.pad   = [tileSpec.pad,   tileSpec.pad];
      if (!(tileSpec.count instanceof Array)) tileSpec.count = [tileSpec.count, tileSpec.count];

      if (tileSpec.count === undefined) tileSpec.count = [1, 1];
      if (tileSpec.pad   === undefined) tileSpec.pad   = [0, 0];

      if (tileSpec.size === undefined) {
         // Just fit tiles in as big as will fit
         let sizeX = Math.floor(img.width  / tileSpec.count[0]);
         let sizeY = Math.floor(img.height / tileSpec.count[1]);
      }

      // This is for the most part the same as the constructor for a Texture.
      this.texW = img.width;
      this.texH = img.height;

      this.tileW = tileSpec.size[0];
      this.tileH = tileSpec.size[1];

      this.padding   = tileSpec.pad;
      this.tileCount = tileSpec.count:

      // Create the atlas texture (note that WebGL doesn't support array textures
      // so we are doing things manually with a TEXTURE_2D)
      this.tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.tex);

      // No mipmaps
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      // Flip y
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      // No texture wraping (regardless of NPOT status)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // Load up the image
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // And unbind for cleanliness
      gl.bindTexture(gl.TEXTURE_2D, null);

      // The vertex buffer is the same for all tiles
      var verts = [
                  0,          0,
         this.tileW,          0,
                  0, this.tileH,
         this.tileW, this.tileH
      ];

      this.vertBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      // The coord buffer is different for each tile, so we dont store any data (yet)
      this.coordBuffer = gl.createBuffer();
   }

   TextureAtlas.protoytpe.getTexture = function(x, y) {
      // This should return a pseudo-Texture object. That is, it should behave like
      // a Texture, but it's functions should refer back here.

      var tex = {};
      tex.w = this.tileW;
      tex.h = this.tileH;

      tex.destroy = function() {};

      tex.bindAttribs = function(vertAttrib, coordAttrib) {
         gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
         gl.vertexAttribPointer(vertexAttrib, 2, gl.FLOAT, false, 0, 0);

         var x0 = x * this.tileW / this.texW;
         var y0 = y * this.tileH / this.texH;
         var w = this.tileW / this.texW;
         var h = this.tileH / this.texH;

         var coords = [
                x0,     y0,
            x0 + w,     y0,
                x0, y0 + h,
            x0 + w, y0 + h
         ];
         gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.DYNAMIC_DRAW);
         gl.vertexAttribPointer(coordAttrib, 2, gl.FLOAT, false, 0, 0);

         gl.bindBuffer(gl.ARRAY_BUFFER, null);
      };
   };
})();

//#ENDIF