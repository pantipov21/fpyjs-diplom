/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
	const xhr = new XMLHttpRequest;
	
	try {
		xhr.addEventListener('readystatechange', (e)=>{
			e.preventDefault();
			if (xhr.readyState === xhr.DONE){
				options.callback(xhr);
			}
		});
		/*
		xhr.addEventListener('progress', (e)=>{
			console.log('loaded:'+e.loaded);
		});
		*/	
		xhr.open(options.method,options.url);
		xhr.responseType = 'json';
		xhr.setRequestHeader("Authorization",options.auth);
		xhr.setRequestHeader("content-type", "application/json");
		xhr.send();
	}
	catch (error){
		console.error(error);
	}
};
