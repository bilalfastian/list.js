module.exports = function(list) {
  return function(initValues, element, notCreate) {
    var item = this;

    this.parentElm = null;
    this._values = {};

    this.found = false; // Show if list.searched == true and this.found == true
    this.filtered = false;// Show if list.filtered == true and this.filtered == true

    var init = function(initValues, element, notCreate) {
      if (element === undefined) {
        if (notCreate) {
          item.values(initValues, notCreate);
        } else {
          item.values(initValues);
        }
      } else {
        item.elm = element;
        var values = list.templater.get(item, initValues);
        item.values(values);
        if(element.parentElement !== undefined)
          item.parentElm = element.parentElement;        
      }
    };
    this.values = function(newValues, notCreate) {
      if (newValues !== undefined) {
        for(var name in newValues) {
          item._values[name] = newValues[name];
        }
        if (notCreate !== true) {
          list.templater.set(item, item.values());
        }
      } else {
        return item._values;
      }
    };
    this.show = function() {
      list.templater.show(item);
    };
    this.hide = function() {
      list.templater.hide(item);
    };
    this.matching = function() {

      // var isSearchMatched = ( (!list.filtered && list.searched && ((item.found && $(item.parentElm).hasClass("found") || ($(item.elm).children("ul.found").length > 0))) ) || 
      //     (!list.filtered && list.searched && (!item.found && $(item.parentElm).hasClass("first-level")) && ($(item.elm).children("ul.found").length > 0)  ) );
      

      return (          

        (list.filtered && list.searched && item.found && item.filtered) ||
        (list.filtered && !list.searched && item.filtered) ||

        (!list.nestedSearch ? (!list.filtered && list.searched && item.found) :
          (!list.filtered && list.searched && 
            (
              (item.found && ( $(item.parentElm).hasClass("found") || $(item.elm).hasClass("found")) || 
              ($(item.elm).children("ul.found").length > 0) ) || (!item.found && ( $(item.parentElm).hasClass("show-all")) )
            )
          )
        ) ||

        // (!list.filtered && list.searched && item.found) ||
        // (!list.filtered && list.searched && item.found && ( $(item.parentElm).hasClass("found") || $(item.elm).hasClass("found")) || ($(item.elm).children("ul.found").length > 0) ) ||

        // (!list.filtered && list.searched && 
        //   (
        //     (item.found && ( $(item.parentElm).hasClass("found") || $(item.elm).hasClass("found")) || ($(item.elm).children("ul.found").length > 0) ) || 
        //     (!item.found && ( $(item.parentElm).hasClass("show-all")) )
        //   )
        // )||

        (!list.filtered && !list.searched)
      );
    };
    this.visible = function() {
      return (item.elm.parentNode == list.list) ? true : false;
    };
    init(initValues, element, notCreate);
  };
};
