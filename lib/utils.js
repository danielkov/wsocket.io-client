module.exports.sortArgsIntoArray = function (fn, fns) {
  let _fns = [];
  if (fns.length > 0 && !Array.isArray(fn)) {
    /* on ('example', function1, function2, function3) */
    _fns = fns;
    _fns.push(fn);
  }
  else if (!Array.isArray(fn) && fns.length == 0) {
    /* on ('example', function1) */
    _fns.push(fn);
  }
  else if (Array.isArray(fn) && fns.length == 0) {
    /* on ('example', [function1, function2, function3]) */
    _fns = fn;
  }
  else {
    /* on ('example', [function1, function2], function3, function4) */
    _fns = fn.concat(fns);
  }
  return _fns;
}
