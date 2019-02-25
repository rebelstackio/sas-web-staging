import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';
import { getMultyLangText } from '../../util';

class Home extends MetaComponent {

	constructor () {
		super();
		this.createArticles = this.createArticles.bind(this);
		this.createArticlesActions = this.createArticlesActions.bind(this);
		this.createBanner = this.createBanner.bind(this);
		document.getElementsByTagName('title')[0].innerText = 'South American\'s Secrets';
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		this.content.className = 'text-content';
		this.createArticles();
		this.createBanner();
		return this.content;
	}
	/**
	 * create the side banner
	 */
	createBanner () {
		const bannerBox = document.createElement('div');
		bannerBox.className = 'banner-box';
		const showcastedBox = document.createElement('div');
		const activitiesBox = document.createElement('div');
		const videoBox = document.createElement('div');
		bannerBox.append(showcastedBox, activitiesBox, videoBox);
		this.appendChild(bannerBox);
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
			getMultyLangText(element.date, articleAuthor, 'p', element.author)
			getMultyLangText(element.title, articleBox, 'div', undefined, 'article-title');
			articleBox.appendChild(articleAuthor);
			getMultyLangText(element.description, articleBox, 'p');
			getMultyLangText(element.blockquote, articleBox, 'blockquote', undefined, 'article-blockquote');
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
			getMultyLangText (el, actionsBox, 'p', undefined, 'btn-orange');
		});
		box.appendChild(actionsBox);
	}
}

window.customElements.define('main-home', Home);
