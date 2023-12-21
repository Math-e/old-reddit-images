// Swaps the text '<image>' links to the actual image with _blank link
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

// add event to rerun loadImages() when DOM is updated from 'load more comments' click
function moreComments(options) {
  // waits new comments to load for 5 seconds, considering worst case scenarios
  // TODO: change waiting with setTimeout to elements update recognition
  setTimeout(function () {
    let moreCommentsButtons = document.querySelectorAll(".morecomments a");

    moreCommentsButtons.forEach(function (value, index, listObj) {
      value.addEventListener("click", loadImages(options))
      value.addEventListener("click", moreComments(options))
    });
  }, 5000);
}


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
  // add event to 'load more comments' buttons for the DOM update
  moreComments(options);
}

// loads options and starts the script
const getting = browser.storage.sync.get("maxHeight");
getting.then(onGot, onError);
