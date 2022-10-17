/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
	  this.imagesWrapper = element;
	  this.previewImage = element.getElementsByClassName('column six wide')[0];
	  
	  this.imagesList = element.getElementsByClassName('row')[0];
	this.btnSelectAll = this.imagesList.nextElementSibling.getElementsByClassName('select-all')[0];
	this.btnSend = this.imagesList.nextElementSibling.getElementsByClassName('send')[0];
	this.btnShowUploadedFiles = this.imagesList.nextElementSibling.getElementsByClassName('show-uploaded-files')[0];
	  
	  this.registerEvents();
	  this.clickCount = 0;
	  this.timeoutId = 0;
	this.megaSelectionFlag = false;
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
	  
		
	  //пункт2.1
	  this.imagesList.addEventListener('click',(event)=>{
		  this.clickCount++;
		  
		  if (this.clickCount==1){
			this.timeoutId = setTimeout(()=>{
				if (this.clickCount == 1){//здесь обрабатывается одинарный клик
					this.clickCount = 0;
					clearTimeout(this.timeoutId);
					  if (event.target.nodeName.toLowerCase()==='img'){
						event.target.classList.toggle('selected');// здесь п.2.2
						this.checkButtonText();
					  }
				}
			},300);
		  }
		  
		  
		  if (this.clickCount >1){//здесь обрабатывается двойной клик
			  clearTimeout(this.timeoutId);
			  this.clickCount=0;
			 
			  if (event.target.nodeName.toLowerCase()==='img'){
				  
				while (this.previewImage.firstChild){
					this.previewImage.removeChild(this.previewImage.firstChild);
				}
				
				  const html = `
				  <img class="ui fluid image" src=${event.target.src}>
				  `;
				  this.previewImage.insertAdjacentHTML('afterbegin', html);
			  }
		  }
	  }, false);
	  //конец п.2.1
	  
	  //пункт 2.3
	  this.btnSelectAll.addEventListener('click', () => {
		const images = Array.from(this.imagesList.getElementsByTagName('div'));
		  
  		if (this.megaSelectionFlag === false){
			for (const elem of images){
				elem.firstChild.classList.add('selected');
			}			
		}
		else
		{
			for (const elem of images){
				elem.firstChild.classList.remove('selected');
			}			
		}
		  
		this.checkButtonText();
	  });
	  
	  //пункт 2.4
	this.btnShowUploadedFiles.addEventListener('click', ()=>{
		const images = Array.from(this.imagesList.getElementsByTagName('div'));
		const fp = App.getModal('filePreviewer');
		fp.elementDOM.children[1].children[0].style.display='block';
		fp.open();
		Yandex.getUploadedFiles((resp)=>{
			if (resp.status==200){
				const res = resp.response.items;
				fp.showImages(res);
				fp.elementDOM.children[1].children[0].style.display='none';
			}
		});
	});
	  //пункт 2.5
	this.btnSend.addEventListener('click', ()=>{
		const fu = App.getModal('fileUploader');
		const images = Array.from(this.imagesList.getElementsByTagName('div'));
		const imagesSelected = [];
		for (const img of images){
			if (img.firstChild.classList.contains('selected')){
				imagesSelected.push(img.firstChild);
			}
		}
		fu.open();
		fu.showImages(imagesSelected);
	});
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
	while (this.imagesList.firstChild){
		this.imagesList.removeChild(this.imagesList.firstChild);
	}
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
	if (images.length > 0){
		this.btnSelectAll.classList.remove('disabled');
		let html=``;
		images.forEach((item) => {
			html = html+`
			<div class='four wide column ui medium image-wrapper'><img src=${item} /></div>
			`;
		});
		this.imagesList.insertAdjacentHTML('beforeend',html);
	}
	else
	{
		this.btnSelectAll.classList.add('disabled');
	}
  }

  /**
   * Контролирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
	const images = Array.from(this.imagesList.getElementsByTagName('div'));
	let s = true;
	let canSend = 0;  
	for (const elem of images){
		if (elem.firstChild.classList.contains('selected') == false){
			s = false;
			canSend++;
		}
		else
		{
			this.btnSend.classList.remove('disabled');
		}
	}
	
	if (canSend == images.length){
		this.btnSend.classList.add('disabled');
	}
	
	if (s===true){
		this.btnSelectAll.innerText = 'снять выделение';
		this.megaSelectionFlag = true;
	}
	else
	{
		this.btnSelectAll.innerText = 'выделить всё';
		this.megaSelectionFlag = false;
	}
  }

}