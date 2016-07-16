//#IFNDEF __HAMSTERJAM_VIOL_TEXTURE
//#DEFINE __HAMSTERJAM_VIOL_TEXTURE

if (!VIOL) VIOL = {};

(function() {
   function Texture(img) {
      // Store width and height
      this.w = img.width;
      this.h = img.height;

      // Create the texture
      this.tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.tex);

      // We don't actually want mipmapping
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      // Flip the y
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      // If our texture is NPOT (non power of two) we need to disable texture wrapping
      if (isPOT(this.w) && isPOT(this.h)) {
         this.NPOT = false;
      }
      else {
         this.NPOT = true;
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }

      // Now load in the actual image
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // Done with texture
      gl.bindTexture(gl.TEXTURE_2D, null);

      // Next let's do the vertex buffer
      var verts = [
              0,      0,
         this.w,      0,
              0, this.h,
         this.w, this.h
      ];

      this.vertBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

      // Finally, the texture coordinate buffer
      var coords = [
         0, 0,
         1, 0,
         0, 1,
         1, 1
      ];

      this.coordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);

      // And cleanup
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
   }

   Texture.prototype.destroy = function() {
      // We need to explicitly destroy WebGL stuff or we will leak
      gl.deleteTexture(this.tex);
      gl.deleteBuffer(this.vertBuffer);
      gl.deleteBuffer(this.coordBuffer);
   };

   function isPOT(x) {
      return (x !== 0) && !(x & (x-1));
   }

   // Export
   VIOL.Texture = Texture;
})();

//#ENDIF
