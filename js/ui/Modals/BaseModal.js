/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
	this.elementBase = element;
	this.elementDOM = element[0];
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
	this.elementBase.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
	this.elementBase.modal('hide');
  }
}