import tpl from '../tpl/partials/tours-page.njk';
let content = document.querySelector('#page-content');
let dataRef = content.getAttribute('data-ref');
let language = 'en';//capture param from url
System.import(`../data/tours/${dataRef}.${language}.js`).then(function(m) {
  console.log(m);
  let data = m.default;
  var html = tpl.render({ data:  data });
  document.querySelector('#page-content').innerHTML = html;

});



