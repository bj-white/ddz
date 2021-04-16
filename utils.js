function hasClass (node, className) {
  var classList = node.className.split(' ');
  if (classList.indexOf(className) !== -1) {
    return true;
  }
  return false;
}

function addClass (node, className) {
  var classList = node.className.split(' ');
  if (classList.indexOf(className) === -1) {
    classList.push(className);
    node.className = classList.join(' ');
  }
}

function removeClass (node, className) {
  var classList = node.className.split(' ');
  var idx = classList.indexOf(className);
  if (idx !== -1) {
    classList.splice(idx, 1);
    node.className = classList.join(' ');
  }
}
