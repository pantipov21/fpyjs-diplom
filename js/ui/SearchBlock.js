/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  
  constructor( element ) {
	this.elementActual = element;
	this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
	const buttons = Array.from(document.getElementsByTagName('button'));
	const btnReplace = buttons.find(item => item.classList.contains('replace'));
	const btnAdd = buttons.find(item => item.classList.contains('add'));
	  
	const idInput = btnReplace.previousElementSibling;
	  	
	btnReplace.onclick = () => {
		if (idInput.value.length>0){
			VK.get(idInput.value,(data)=>{
				App.imageViewer.clear();
				App.imageViewer.drawImages(data);
			});
			return false;
		}
	}		
	
	btnAdd.onclick = () => {
		if (idInput.value.length>0){
			VK.get(idInput.value,(data)=>{
				App.imageViewer.drawImages(data);
			});
			return false;
		}
	}
  }

}