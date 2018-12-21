import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';

class Home extends MetaComponent {

	constructor () {
		super();
		this.createArticles = this.createArticles.bind(this);
		this.createAticlesImg = this.createAticlesImg.bind(this);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		this.content.className = 'text-content';
		this.banners = document.createElement('div');
		this.content.append(this.articlesArea, this.banners);
		this.createArticles();
		this.createAticlesImg();
		return this.content;
	}
	/**
	 * create the images for each article
	 */
	createAticlesImg () {
		const {lastNews} = global.storage.getState().Main;
		lastNews.forEach(element => {
			const boxImg = document.createElement('div');
			boxImg.className = 'box-img';
			const img = document.createElement('img');
			img.setAttribute('src', element.url_image)
			this.content.appendChild()
		})
	}
	/**
	 * create each article
	 */
	createArticles () {
		const {lastNews} = global.storage.getState().Main;
		lastNews.forEach(element => {
			const articleBox = document.createElement('div');
			const articleAuthor = document.createElement('div');
			articleAuthor.innerHTML = element.author;
			this.getMultyLangText(element.title, articleBox, 'div')
			articleBox.appendChild(articleAuthor)
			this.getMultyLangText(element.description, articleBox, 'p')
			this.content.appendChild(articleBox);
		});
	}
	/**
	 * create the html tags in both languages for the articles text
	 * @param {Object} data 
	 * @param {HTMLElement} box 
	 * @param {String} type 
	 */
	getMultyLangText (data, box, type) {
		Object.keys(data).forEach(k => {
			const el = document.createElement(type)
			el.innerHTML = data[k];
			el.setAttribute('lang', k)
			box.appendChild(el);
		})
	}
}

window.customElements.define('main-home', Home);
