/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal{
  constructor( element ) {
	super(element);
	  this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
	const cross = this.elementDOM.getElementsByTagName('i')[0];
	cross.addEventListener('click',()=>{
		const contentArea = this.elementDOM.getElementsByClassName('scrolling content')[0];
		const previews = Array.from(contentArea.getElementsByClassName('image-preview-container'));

		for (const elem of previews){
			elem.remove();
		}
		this.close();
	});

	const contentArea = this.elementDOM.getElementsByClassName('scrolling content')[0];
	contentArea.addEventListener('click', (event)=>{
		
		event.preventDefault();		
		let elem = event.target;
		
		if ((elem.tagName.toLowerCase()==='i')&&(elem.classList.contains('trash'))){
			elem = event.target.parentElement;
		}
		
		if (elem.classList.contains('delete')){
			const icon = elem.getElementsByTagName('i')[0];
			icon.classList.add('icon');
			icon.classList.add('spinner');
			icon.classList.add('loading');
			
			elem.classList.add('disabled');
			
			//здесь удаляется изображение с диска
			Yandex.removeFile(elem.getAttribute('data-path'), (resp)=>{
				if (resp.status<=204){
					const imgContainer = elem.parentElement.parentElement;
					imgContainer.remove();
				}
			});
		}
		
		
		if ((elem.tagName.toLowerCase()==='i')&&(elem.classList.contains('download'))){
			elem = event.target.parentElement;
		}
		if (elem.classList.contains('download')){
			Yandex.downloadFileByUrl(elem.getAttribute('data-file'));
		}
	},false);
  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
	  const contentArea = this.elementDOM.getElementsByClassName('scrolling content')[0];
	  for (const elem of data.reverse()){
		  contentArea.insertAdjacentHTML('beforeend',this.getImageInfo(elem));
	  }	
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
	  const months = ['января','ферваля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря',];
	  let dt = new Date(Date.parse(date));
//	   return dt.getDate()+' '+dt.toLocaleString("ru-ru",{month:"long"})+' '+dt.getFullYear()+'г. в '+dt.getHours()+':'+dt.getMinutes();
	   return dt.getDate()+' '+months[dt.getMonth()]+' '+dt.getFullYear()+'г. в '+dt.getHours()+':'+dt.getMinutes();
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
	  let size = Math.round(item.size/1024);
	  
	  let html = `
		<div class="image-preview-container">
		  <img src=${item.file}>
		  <table class="ui celled table">
		  <thead>
		    <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
		  </thead>
		  <tbody>
		    <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${size}Кб</td></tr>
		  </tbody>
		  </table>
		  <div class="buttons-wrapper">
		    <button class="ui labeled icon red basic button delete" data-path="${item.path}">
		      Удалить
		      <i class="trash icon"></i>
		    </button>
		    <button class="ui labeled icon violet basic button download" data-file="${item.file}">
		      Скачать
		      <i class="download icon"></i>
		    </button>
		  </div>
		</div>
	`;
	return html;
  }
}
