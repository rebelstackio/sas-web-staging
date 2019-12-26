import { getPageLanguage } from './utils';

let language = getPageLanguage('lng') || 'en' ;

System.import(`../data/splash/index.${language}.js`).then((res) => {
    console.log(res.default);
    setPresentation(res.default, 0)
});

function setPresentation(data, i) {
    const el = data[i];
    document.querySelector('pretty-modal .splash-ad').innerHTML =
    `
    <picture>
        <source media="(max-width: 500px)" srcset="https://res.cloudinary.com/dvv4qgnka/image/upload/v1576877525/SAS/salaberry_splash_pt.jpg">
        <img src="https://res.cloudinary.com/dvv4qgnka/image/upload/v1576794897/SAS/salaberry_splash.jpg">
    </picture>
    <div class="img-wrapper">
        <div class="splash-title">
            <h2>${ el.title }</h2>
            <h3>${ el.subtitle }</h3>
        </div>
        <div class="splash-description">
            ${ el.itinerary.map(it => {
                return `
                    <div>
                        <span>
                            <i>${it.date}</i>
                            <i class="fas fa-long-arrow-alt-right"></i>
                            <strong>${it.destination}</strong> ${it.title} 
                        </span>
                    </div>
                `
            }).join('')}
        </div>
        <div class="book-btn">
            <pretty-button type="danger" size="large" id="C-${i}" value="See Tour"></pretty-button>
        </div>
    </div>
    <div class="best-seller">
        Best Seller
    </div>
    `
}