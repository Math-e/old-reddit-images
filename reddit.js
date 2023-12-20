function onError(error) {
  console.log(`Old Reddit Images Error: ${error}`);
}

function onGot(options) {
  // default option if storage option is empty
  if (!options.maxHeight) {
    options.maxHeight = "500";
  }
  // after loading option, swap the links to images in DOM
  loadImages(options);
}

function loadImages(options) {

  // '.md a' are links in comments and some sidebar links
  let links = document.querySelectorAll(".md a");
  links.forEach(function (value, index, listObj) {

    // pick links with '<image>' text, which are the commented images that don't load in old reddit
    if (value.text == "<image>") {

      var newElement = document.createElement("img");
      newElement.src = value.href;
      newElement.style['max-height'] = options.maxHeight + "px";
      // insert image by swapping the text under <a>, so the image stays clickable
      value.firstChild.replaceWith(newElement);
    }
  });
}

// loads options
const getting = browser.storage.sync.get("maxHeight");
getting.then(onGot, onError);
