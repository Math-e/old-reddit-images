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

// the observer, which triggers whenever a DOM element and its children is updated
function watchMutation(element, options){
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      // for comment section
      if (mutation.type === "childList") {
        loadImages(element, options);
      // for expandos
      } else if (mutation.type === "attributes") {
        loadImages(element, options);
      }
    }
  };
  const observer = new MutationObserver(callback);
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(element, config);
}

function commentsUpdate(element, options){
  let el = element.querySelector('div .nestedlisting');
  watchMutation(el, options);
}

function watchExpandos(element, options){
  // buttons to expand the text post that might contain 'preview.redd.it' links
  let expandos = element.querySelectorAll("div .expando-uninitialized");
  // when their hidden section is updated, load the images
  expandos.forEach(ex => {
    watchMutation(ex, options);
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
  // the "expand (text) post" grey buttons, which take a few miliseconds to loads and may contain a 'preview.redd.it' link
  watchExpandos(document, options);
  // swap the links to images in root DOM
  loadImages(document, options);
  // reruns loadImages() when comment section is updated (for clicking "load more comments"). Might need performance improvements.
  commentsUpdate(document.querySelector("div .commentarea"), options);
}

// loads options and starts the script
const getting = browser.storage.sync.get(["maxHeight", "openTab"]);
getting.then(onGot, onError);
