/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net:443/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
	  let token = localStorage.getItem('yandex_token');
	  if (token==null){
		  let res = null;
		  while (res == null){
			res = prompt('Для продолжения работы необходимо ввести токен для Яндекса');
		  }
		  token = res;
	  }
	  localStorage.setItem('yandex_token',token);
	  return token;
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
	  // path - КУДА НА ЯНДЕКС.ДИСКЕ
	  //
	  // url - местоположение картинки
	  createRequest({
		method: "POST",
		url: Yandex.HOST+"/resources/upload/?path="+encodeURIComponent(path)+"&url="+encodeURIComponent(url),
		auth:"OAuth "+Yandex.getToken(),
		callback: callback,
	  });	  
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
	createRequest({
		method: "DELETE",
		url: Yandex.HOST+"/resources?path="+encodeURIComponent(path),
		auth:"OAuth "+Yandex.getToken(),
		callback: callback,
	});
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
	createRequest({
		method: "GET",
		//url: Yandex.HOST+"/resources/files?limit=1000",
		url: Yandex.HOST+"/resources/last-uploaded?limit=5&media_type=image",
		auth:"OAuth "+Yandex.getToken(),
		callback: callback,
	});
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url){
	const link = document.createElement('a');
	link.href=url;
	  link.onclick = () =>{
		location.href = url;  
	  };
	  let event = new Event("click");
	  link.dispatchEvent(event);
  }
}

/*
https://downloader.disk.yandex.ru/disk/b4284c7f87bbcd82b77f74c32ff02cf591b6bc42afd36f74313d3c8c0dacfc23/634d6cda/8xabnAY0eqlktXc66c0u5LtjBVrkl17gRwIAocuBiY_01vJCKT3Nnem7FeTqTRUuO6Khq2mPQDLwXlSl3OT_2A%3D%3D?uid=1207086&filename=8.jpg&disposition=attachment&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=1207086&fsize=278633&hid=6608115a45ae08e1ee6c36b70b4be0b6&media_type=image&tknv=v2&etag=5a67d92f104272c0d097e479e7e49997
*/