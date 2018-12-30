import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';

class Home extends MetaComponent {

	constructor () {
		super();
		this.createArticles = this.createArticles.bind(this);
		this.createArticlesActions = this.createArticlesActions.bind(this);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		this.content.className = 'text-content';
		this.createArticles();
		return this.content;
	}
	/**
	 * create each article
	 */
	createArticles () {
		const {lastNews} = global.storage.getState().Main;
		lastNews.forEach(element => {
			const articleBox = document.createElement('div');
			articleBox.className = 'article-box';
			const articleAuthor = document.createElement('div');
			articleAuthor.className = 'article-author';
			this.getMultyLangText(element.date, articleAuthor, 'p', element.author)
			this.getMultyLangText(element.title, articleBox, 'div', undefined, 'article-title');
			articleBox.appendChild(articleAuthor);
			this.getMultyLangText(element.description, articleBox, 'p');
			this.getMultyLangText(element.blockquote, articleBox, 'blockquote', undefined, 'article-blockquote');
			const boxImg = document.createElement('div');
			boxImg.className = 'box-img';
			const img = document.createElement('img');
			img.setAttribute('src', element.url_image);
			boxImg.append(img);
			this.createArticlesActions(articleBox);
			this.content.append(boxImg, articleBox);
		});
	}
	/**
	 * 
	 * @param {HTMLElement} box 
	 */
	createArticlesActions (box) {
		const {utils} = global.storage.getState().Main;
		const actionsBox = document.createElement('div');
		actionsBox.className = 'actions-box';
		utils.home.actions.forEach((el) => {
			this.getMultyLangText (el, actionsBox, 'p', undefined, 'btn-orange');
		});
		box.appendChild(actionsBox);
	}
	/**
	 * create the html tags in both languages for the articles text
	 * @param {Object} data 
	 * @param {HTMLElement} box 
	 * @param {String} type
	 * @param {String} apendix NON-MANDATORY
	 * @param {String} className NON-MANDATORY
	 */
	getMultyLangText (data, box, type, apendix, className) {
		Object.keys(data).forEach(k => {
			const el = document.createElement(type)
			el.innerHTML = apendix ? data[k] + '-' + apendix : data[k];
			el.setAttribute('lang', k)
			if (className) {
				el.classList.add(className);
			}
			box.appendChild(el);
		})
	}
}

window.customElements.define('main-home', Home);
