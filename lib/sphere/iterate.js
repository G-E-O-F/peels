(function(module){

  var _ = require('lodash'),
      uid = require('uid'),
      async = require('async');

  module.exports = function(perField, done){

    var Sphere = this,
        iterid = uid(8);

    if(Sphere._iteration){
      Sphere._iteration.current = iterid;
    }else{
      Sphere._iteration = {
        current: iterid
      }
    }

    var fieldIterator;

    if(Sphere._geometry && _.isFunction(Sphere._colorFn)){
      fieldIterator = function(field, doneField){
        perField.call(field, function(){
          Sphere.assignColor(field, Sphere._colorFn.call(field, field.data, field._pos, field._sxy));
          doneField.apply(this, arguments);
        });
      }
    }else{
      fieldIterator = function(field, doneField){
        perField.call(field, doneField);
      }
    }

    async.parallel([
      function(doneNorth){
        fieldIterator(Sphere._North, doneNorth);
      },
      function(doneSouth){
        fieldIterator(Sphere._South, doneSouth);
      },
      function(doneSections){
        async.each(Sphere._Fields, function(section, doneSection){
          async.each(section, function(column, doneColumn){
            async.each(column, fieldIterator, doneColumn);
          }, doneSection);
        }, doneSections);
      }
    ], function(){
      Sphere._iteration.previous = iterid;
      Sphere._iteration.current = null;
      done.apply(null, arguments);
    });

  };

}(module));