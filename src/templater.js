var getByClass = require('get-by-class');

var Templater = function(list) {
  var itemSource = getItemSource(list.item),
    templater = this;

  function getItemSource(item) {
    if (item === undefined) {
      var nodes = list.list.childNodes,
        items = [];

      if(list.nestedSearch){
        nodes = (nodes ? nodes.length = 0 : []);
        
        for(var j = 0; j < list.list.length; j++){
          for(var k=0; k < list.list[j].childNodes.length; k++)
            nodes.push(list.list[j].childNodes[k]);        
        }
      }

      for (var i = 0, il = nodes.length; i < il; i++) {
        // Only textnodes have a data attribute
        if (nodes[i].data === undefined) {
          return nodes[i];
        }
      }
      return null;
    } else if (item.indexOf("<") !== -1) { // Try create html element of list, do not work for tables!!
      var div = document.createElement('div');
      div.innerHTML = item;
      return div.firstChild;
    } else {
      return document.getElementById(list.item);
    }
  }

  /* Get values from element */
  this.get = function(item, valueNames) {
    templater.create(item);
    var values = {};
    for(var i = 0, il = valueNames.length; i < il; i++) {
      var elm = getByClass(item.elm, valueNames[i], true);
      values[valueNames[i]] = elm ? elm.innerHTML : "";
    }
    return values;
  };

  /* Sets values at element */
  this.set = function(item, values) {
    if (!templater.create(item)) {
      for(var v in values) {
        if (values.hasOwnProperty(v)) {
          // TODO speed up if possible
          var elm = getByClass(item.elm, v, true);
          if (elm) {
            /* src attribute for image tag & text for other tags */
            if (elm.tagName === "IMG" && values[v] !== "") {
              elm.src = values[v];
            } else {
              elm.innerHTML = values[v];
            }
          }
        }
      }
    }
  };

  this.create = function(item) {
    if (item.elm !== undefined) {
      return false;
    }
    /* If item source does not exists, use the first item in list as
    source for new items */
    var newItem = itemSource.cloneNode(true);
    newItem.removeAttribute('id');
    item.elm = newItem;
    templater.set(item, item.values());
    return true;
  };
  this.remove = function(item) {
    if(list.nestedSearch){
      if (item.elm.parentNode === list.list)
        list.list.removeChild(item.elm);
    }
    else
      $(item.elm).remove();
  };
  this.show = function(item) {
    templater.create(item);
    if(!list.nestedSearch)
      list.list.appendChild(item.elm);
    else
      $(item.parentElm).append(item.elm);
  };
  this.hide = function(item) {
    if (item.elm !== undefined) {      
      if(!list.nestedSearch && item.elm.parentNode === list.list)
          list.list.removeChild(item.elm);
      else 
        $(item.elm).remove();
    }
  };
  this.clear = function() {
    /* .innerHTML = ''; fucks up IE */

    if(!list.nestedSearch){
      if (list.list.hasChildNodes()) {
        while (list.list.childNodes.length >= 1){
          list.list.removeChild(list.list.firstChild);
        }
      }      
    }else{
      for (var i = 0; i < list.list.length; i++) {
          var tmpList = list.list[i];

          if (tmpList.hasChildNodes()) {
            while (tmpList.childNodes.length >= 1){
                tmpList.removeChild(tmpList.firstChild);
            }
          }
      }          
    }
  };
};

module.exports = function(list) {
  return new Templater(list);
};
