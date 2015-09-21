var fileref = document.createElement('script');
if (window.location.search.indexOf('production') !== -1) {
  fileref.setAttribute('src', '../dist/ole.js');
} else {
  fileref.setAttribute('src', 'ole-debug.js');
}
document.getElementsByTagName("head")[0].appendChild(fileref);
