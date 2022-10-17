/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN ='vk1.a.yutt9u8KdqQTjo5fjmVgAxU3kMhWnG7f181BiQObj3Tps0dRuUDmlKsNqV9sQocr-qgNR3yQygKdMGr6j_SD1lzP0Hhg6S2h2bNGt7U0j4EwhoPHBikjDwS_9kXXxrpAAucNkzTLAIcV2UWfjx2JYMYZrx4GmW3V3OXbiQxZu42K4k-ZOi5Nfs1dhwLl1tKF';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback){
	VK.lastCallback = callback;
	  
	const script = document.createElement('SCRIPT');
	  const url =
		"https://api.vk.com/method/photos.get?"+
		"owner_id="+id+
		"&album_id=profile"+
		"&access_token="+this.ACCESS_TOKEN+
		"&v=5.131&callback=VK."+VK.processData;
	
	script.src = url.slice(0,url.indexOf('('));	  
	  
	document.getElementsByTagName("head")[0].appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
	try {
		const script = document.getElementsByTagName("head")[0].lastChild;
		script.remove();
		
		/*
		Найдите самые крупные изображения из ответа от сервера и передайте 
		изображения в колбек, 
		который передавался в метод VK.get, который сохранялся в lastCallback.
		Обновите свойство lastCallback на функцию "пустышку" () => {}.
		*/
		const photoArray = result.response.items;
		const photoResults = [];
		photoArray.forEach((photo) =>{
			const sizes = [];
			for (const i of photo.sizes){
				sizes.push(Number(i.height));
			}
			const indexMax = sizes.indexOf(Math.max(...sizes));
			photoResults.push(photo.sizes[indexMax].url)
		});
		VK.lastCallback(photoResults);

		VK.lastCallback = () =>{};
	}
	catch (e) {
		alert(`${e.name}: ${e.message}`);
	}
  }
}
