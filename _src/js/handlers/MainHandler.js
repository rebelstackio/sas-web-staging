/*
* DEFAULT HANDLER
*/

const MainDefaultState = {
	menuData: global.menuData,
	lang: 'en',
	lastNews: global.lastNews,
	utils: global.utils,
	tourPackages: global.tourPackages
};

export default {
	MainDefaultState,
	MainHandler: {
		'CHANGE_LANG': (action, state) => {
			state.Main.lang = action.value;
			return { newState: state };
		}
	}
};
