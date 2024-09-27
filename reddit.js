// Swaps the text '<image>' and 'preview.redd.it' links to the actual image with link
function loadImages(elements, options) {
  // '.md a' are links in comments and some sidebar links
  let links = elements.querySelectorAll(".md a");
  links.forEach(element => {

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

function watchClass(element, elClass, options){
  let prevState = element.classList.contains(elClass);
  const observer = new MutationObserver((mutations) => { 
    mutations.forEach((mutation) => {
        const { target } = mutation;
        if (mutation.attributeName === 'class') {
            const currentState = mutation.target.classList.contains(elClass);
            if (prevState !== currentState) {
                prevState = currentState;
                loadImages(element, options);
            }
        }
    });
});
 observer.observe(element, { 
  attributes: true, 
  attributeOldValue: true, 
  attributeFilter: ['class'] 
  });
}


// add event to rerun loadImages() when DOM is updated from 'load more comments' click
function moreComments(element, options) {
  // waits new comments to load for 5 seconds, considering worst case scenarios
  // TODO: change waiting with setTimeout to elements update recognition
    let moreCommentsButtons = element.querySelectorAll(".morecomments > a");
    moreCommentsButtons.forEach(el => {
      // 'nestedlisting' is the comment section, run the functions when it is updated
      watchClass(el, 'nestedlisting', options);
    });
}

function watchExpandos(element, options){
  // buttons to expand the text post that might contain 'preview.redd.it' links
  let expandos = element.querySelectorAll("div .expando-uninitialized");
  // when their hidden section is updated, load the images
  expandos.forEach(ex => {
    watchClass(ex, 'expando-uninitialized', options);
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
  //
  watchExpandos(document, options);
  // after loading option, swap the links to images in DOM
  loadImages(document, options);
  // add event to 'load more comments' buttons for the DOM update //// needs update
  // moreComments(document, options);
}

// loads options and starts the script
const getting = browser.storage.sync.get(["maxHeight", "openTab"]);
getting.then(onGot, onError);
