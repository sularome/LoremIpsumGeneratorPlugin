opera.isReady(function(){
window.addEventListener("load", function() {
  var theButton;
  var ToolbarUIItemProperties = {
    title: "Lorem Ipsum Generator",
    icon: "icons/lorem.png",
    popup: {
      href: "popup.html",
      width: 510,
      height: 430
    }
  };
  theButton = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);
  opera.contexts.toolbar.addItem(theButton);
}, false);
});
