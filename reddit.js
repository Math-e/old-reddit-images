// Swaps the text '<image>' and 'preview.redd.it' links to the actual image with _blank link
function loadImages(options) {

  // '.md a' are links in comments and some sidebar links
  let links = document.querySelectorAll(".md a");
  links.forEach(function (element, index, listObj) {

    // pick links with '<image>' text, which are the commented images that don't load in old reddit, and inserted images which get the pure link as text
    if (element.text == "<image>" || element.text.startsWith('https://preview.redd.it/')) {

      var newElement = document.createElement("img");
      newElement.src = element.href;
      newElement.style['max-height'] = options.maxHeight + "px";
      // change <a> target depending on config
      element['target'] = options.openTab;
      // insert image by swapping the text under <a>, so the image stays clickable
      element.firstChild.replaceWith(newElement);
    }
  });
}

function expandoVisibility(element, callback){
  var root = {
    root: document.documentElement
  }
  var observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      callback(entry.intersectionRatio > 0);
    });
  }, root);

  observer.observe(element);
}

// add event to rerun loadImages() when DOM is updated from 'load more comments' click
function moreComments(options) {
  // waits new comments to load for 5 seconds, considering worst case scenarios
  // TODO: change waiting with setTimeout to elements update recognition
  setTimeout(function () {
    let moreCommentsButtons = document.querySelectorAll("span .morecomments > a");
    moreCommentsButtons.forEach(function (element, index, listObj) {
      element.addEventListener("click", loadImages(options));
      //element.addEventListener("click", moreComments(options));
    });
  }, 5000);

  // buttons to expand the text post that might contain 'preview.redd.it' links
  let expandos = document.querySelectorAll("div .expando-uninitialized");
  expandos.forEach(expando => {
    expandoVisibility(expando, visible => {
      if (visible){
        expando.addEventListener("DOMContentLoaded", loadImages(options))
      }
    })
  })

}


function onError(error) {
  console.log(`Old Reddit Images Error: ${error}`);
}

function onGot(options) {
  // default option if storage option is empty
  if (!options.maxHeight) {
    options.maxHeight = "500";
  }
  if (!options.openTab) {
    options.openTab = "_blank";
  }
  // after loading option, swap the links to images in DOM
  loadImages(options);
  // add event to 'load more comments' buttons for the DOM update
  moreComments(options);
}

// loads options and starts the script
const getting = browser.storage.sync.get(["maxHeight", "openTab"]);
getting.then(onGot, onError);
