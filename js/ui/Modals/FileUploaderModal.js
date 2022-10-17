/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
	super(element);
	  this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   + 1. Клик по крестику на всплывающем окне, закрывает его
   + 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   + 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
	  
	const cross = this.elementDOM.getElementsByTagName('i')[0];
	  const btnClose = this.elementDOM.getElementsByClassName('close')[0];
	const btnSendAll =  this.elementDOM.getElementsByClassName('send-all')[0];
	const contentArea = this.elementDOM.getElementsByClassName('scrolling content')[0];

	cross.addEventListener('click',()=>{
		const previews = Array.from(contentArea.getElementsByClassName('image-preview-container'));
		for (const elem of previews){
			elem.remove();
		}
		this.close();
	});
	
	btnClose.addEventListener('click',()=>{
		const previews = Array.from(contentArea.getElementsByClassName('image-preview-container'));
		for (const elem of previews){
			elem.remove();
		}
		this.close();
	});
	
	btnSendAll.addEventListener('click',()=>{
		this.sendAllImages();
	});
	
	contentArea.addEventListener('click', (event)=>{
		
		event.preventDefault();
		console.log('contentArea!!!',contentArea);
		
		const elem = event.target;
		if (elem.nodeName.toLowerCase()==="input"){
			elem.parentElement.classList.remove("error");
		}
		if (elem.nodeName.toLowerCase()==="button"){
			console.log('BUTTON');
			this.sendImage(elem.parentElement.parentElement);
		}
		else
		if (elem.nodeName.toLowerCase()==="i"){
			console.log('ICON');
			this.sendImage(elem.parentElement.parentElement.parentElement);
		}

	},false);
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
	  const contentArea = this.elementDOM.getElementsByClassName('scrolling content')[0];
	  for (const elem of images.reverse()){
		  contentArea.insertAdjacentHTML('beforeend',this.getImageHTML(elem));
		  //contentArea.innerHTML = contentArea.innerHTML + this.getImageHTML(elem);//на практике говорили, что запись 
		  //напрямую в innerHTML небезопасна. 	  
	  }
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
	  let html = `
	    <div class="image-preview-container">
		<img src=${item.src}>
		<div class="ui action input">
		      <input type="text" placeholder="Путь к файлу">
		      <button class="ui button"><i class="upload icon"></i></button>
		</div>
	   </div>
	`;
	return html;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
	const contentArea = this.elementDOM.getElementsByClassName('scrolling content')[0];
	const ipc = contentArea.getElementsByClassName('image-preview-container');
	for (const img of ipc){
		this.sendImage(img);
	}
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
	console.log('IMAGE CONTAINER',imageContainer);
	const input = imageContainer.getElementsByTagName('input')[0];
	if (input.value.length>0){
		input.parentElement.classList.add('disabled');
		const path = input.value;
		const url = imageContainer.getElementsByTagName('img')[0].getAttribute('src');
		console.log(path);
		console.log(url);
		
		Yandex.uploadFile(path,url,(resp)=>{
			imageContainer.remove();
			const contentArea = this.elementDOM.getElementsByClassName('scrolling content')[0];
			const ipc = Array.from(contentArea.getElementsByClassName('image-preview-container'));
			if (ipc.length==0){
				this.close();
			}
			
		});

	}
	else
	{
		input.parentElement.classList.add("error");
	}
  }
}