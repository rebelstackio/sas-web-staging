import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';

class Home extends MetaComponent {
	/**
	 * MetaComponent constructor needs storage.
	 */
	constructor () {
		super();
		this.createArticles = this.createArticles.bind(this);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		const content = document.createElement('div');
		this.articlesArea = document.createElement('div');
		this.banners = document.createElement('div');
		content.append(this.articlesArea, this.banners);
		this.createArticles();
		return content;
	}

	createArticles () {
		const {lastNews} = global.storage.getState().Main;
		lastNews.forEach(element => {
			const articleBox = document.createElement('div');
			const articleAuthor = document.createElement('div');
			articleAuthor.innerHTML = element.author;
			this.getMultyLangText(element.title, articleBox, 'div')
			articleBox.appendChild(articleAuthor)
			this.getMultyLangText(element.description, articleBox, 'p')
			this.articlesArea.appendChild(articleBox);
		});
	}

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
