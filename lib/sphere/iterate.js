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

    async.parallel([
      function(doneNorth){
        perField.call(Sphere._North, doneNorth);
      },
      function(doneSouth){
        perField.call(Sphere._South, doneSouth);
      },
      function(doneSections){
        async.each(Sphere._Fields, function(section, doneSection){
          async.each(section, function(column, doneColumn){
            async.each(column, function(field, doneField){
              perField.call(field, doneField);
            }, doneColumn);
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