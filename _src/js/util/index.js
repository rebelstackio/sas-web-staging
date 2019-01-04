	/**
	 * @param {Object} data 
	 * @param {HTMLElement} box 
	 * @param {String} type
	 * @param {String} apendix NON-MANDATORY
	 * @param {String} className NON-MANDATORY
	 */
	function getMultyLangText (data, box, type, apendix, className) {
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
	/**
	 * @param {Object} data 
	 * @param {HTMLElement} box 
	 * @param {String} className NO-MANDATORY
	 * @param {String} url 
	 */
	function getMultyLangLink (data, box, className, url) {
		Object.keys(data).forEach(k => {
			const el = document.createElement('a')
			el.innerHTML = data[k];
			el.setAttribute('lang', k)
			el.href = '#' + url;
			el.setAttribute('data-navigo',"");
			if (className) {
				el.classList.add(className);
			}
			box.appendChild(el);
		})
	}

	export {
		getMultyLangText,
		getMultyLangLink
	}
	