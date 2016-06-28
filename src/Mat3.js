//#IFNDEF __HAMSTERJAM_VIOL_MAT3
//#DEFINE __HAMSTERJAM_VIOL_MAT3

if (!VIOL) var VIOL = {};

(function() {

   function Mat3(data) {
      if (data === undefined) {
         data = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
         ];
      }
      this.data = data;
   }

   Mat3.prototype.mul = function(rhs) {
      var l = this.data;
      var r = rhs.data;

      return new Mat3([
            l[0]*r[0] + l[1]*r[3] + l[2]*r[6], l[0]*r[1] + l[1]*r[4] + l[2]*r[7], l[0]*r[2] + l[1]*r[5] + l[2]*r[8],
            l[3]*r[0] + l[4]*r[3] + l[5]*r[6], l[3]*r[1] + l[4]*r[4] + l[5]*r[7], l[3]*r[2] + l[4]*r[5] + l[5]*r[8],
            l[6]*r[0] + l[7]*r[3] + l[8]*r[6], l[6]*r[1] + l[7]*r[4] + l[8]*r[7], l[6]*r[2] + l[7]*r[5] + l[8]*r[8]
      ]);
   };

   // The a stands for 'affine'. If both matricies represent an affine
   // transformation, feel free to use this faster version.
   Mat3.prototype.aMul = function(rhs) {
      var l = this.data;
      var r = rhs.data;

      return new Mat3([
            l[0]*r[0] + l[1]*r[3], l[0]*r[1] + l[1]*r[4], l[0]*r[2] + l[1]*r[5] + l[2],
            l[3]*r[0] + l[4]*r[3], l[3]*r[1] + l[4]*r[4], l[3]*r[2] + l[4]*r[5] + l[2],
                                0,                     0,                            1
      ]);
   };

   Mat3.prototype.transpose = function() {
      var d = this.data;

      return new Mat3([
            d[0], d[3], d[6],
            d[1], d[4], d[7],
            d[2], d[5], d[8]
      ]);
   };

   Mat3.identity = function() {
      return new Mat3();
   };

   Mat3.translate = function(dx, dy) {
      return new Mat3([
            1, 0, dx,
            0, 1, dy,
            0, 0,  1
      ]);
   };

   Mat3.scale = function(sx, sy) {
      return new Mat3([
            sx,  0, 0,
             0, sy, 0,
             0,  0, 1
      ]);
   };

   Mat3.shear = function(sx, sy) {
      return new Mat3([
             1, sx, 0,
            sy,  1, 0,
             0,  0, 1
      ]);
   };

   Mat3.rotate = function(t) {
      var sinT = Math.sin(t);
      var cosT = Math.cos(t);

      return new Mat3([
            cosT, -sinT, 0,
            sinT,  cosT, 0,
               0,     0, 1
      ]);
   };

   // Export
   VIOL.Mat3 = Mat3;
})();

//#ENDIF
