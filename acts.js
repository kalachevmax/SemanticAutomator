

var act = {};


act.MESSAGES = {
  make: 'The application has been successfully built'
};


act.make = fm.script([
  act.fs.readFilesTree,
  act.gcc.makeArgs,
  act.gcc.invoke
]);


act.update = fm.script([
]);


act.publish = fm.script([

]);


module.exports = act;
