//#IFNDEF __HAMSTERJAM_VIOL_LOADER
//#DEFINE __HAMSTERJAM_VIOL_LOADER

if (!VIOL) var VIOL = {};

VIOL.load = function(manifestURL, callback) {
   var res = {};
   var manifest = [];

   var loader = new XMLHttpRequest();
   loader.addEventListener('load', function(){
      manifest = JSON.parse(this.responseText);
      loadItems();
   });
   loader.open('GET', manifestURL);
   loader.send();

   function loadItems() {
      var numItems = manifest.length;
      var itemsRem = numItems;

      for(let i=0; i < numItems; ++i) {
         let item = manifest[i];

         // Don't load images with AJAX, load it as a DOM image
         if (item.type === "image") {
            res[item.name] = new Image();
            res[item.name].src = item.src;
            res[item.name].onload = function() {
               --itemsRem;
               if (itemsRem === 0) callback(res);
            }
            continue;
         }

         let loader = new XMLHttpRequest();
         // Have to do it like this or it will read whatever value of item the loop is currently up to.
         // In practise that means that everything loads as whatever is last in the manifest.
         //
         // There is probably a standard name for this kind of (function(thing){ })(thing); structure,
         // for now I'm calling it a bind (which is a bad idea because of Function.prototype.bind)
         (function(item) {
            loader.addEventListener('load', function() {
               if (item.type === "json") {
                  res[item.name] = JSON.parse(this.responseText);
               }
               else {
                  res[item.name] = this.responseText;
               }

               --itemsRem;
               if (itemsRem === 0) callback(res);
            });
         })(item);
         loader.open('GET', item.src);
         loader.send();
      }
   }
};

//#ENDIF
