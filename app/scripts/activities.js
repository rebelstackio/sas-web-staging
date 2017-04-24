import tpl from '../tpl/partials/activities-page.njk';
let content = document.querySelector('#page-content');
let dataRef = content.getAttribute('data-ref');
System.import(`../data/activities/${dataRef}.en.js`).then(function(m) {
  console.log(m);
  let data = m.default;
  var html = tpl.render({ data:  data });
  document.querySelector('#page-content').innerHTML = html;

});



