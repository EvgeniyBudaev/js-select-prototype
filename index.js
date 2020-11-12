(function () {
    'use strict'
    
    // Функция-конструктор
    const Select = function (selector, options) {
        this.selector = selector
        this.options = options
        this.selectedId = options.selectedId
        this.inputHiddenValue = null
        this.data = null
        // основные DOM-элементы галереи определяющие её каркас
        this.select = document.querySelector(this.selector)
        this.inputHidden = document.querySelector('[data-input="hidden"]')
        this.span = this.select.querySelector('[data-type="value"]')
        this.init()
        this.setup()
    }

    // запишем конструктор в свойство 'window.Select', чтобы обеспечить
    // доступ к нему снаружи анонимной функции
    window.Select = Select;

    // для сокращения записи, создадим переменную, которая будет ссылаться
    // на прототип 'Select'
    const fn = Select.prototype;


    fn.init = function() {
        this.select.classList.add('select')
    }


    fn.setup = function() {
        this.data = this.generateArrayObjects(this.select)
        this.inputHiddenValue = this.current().value
        this.inputHidden.value = this.inputHiddenValue
        this.span.innerHTML = this.current().value
        this.clickHandler = this.clickHandler.bind(this)
        if (this.select) {
            this.select.addEventListener('click', this.clickHandler)
            this.$value = this.select.querySelector('[data-type="value"]')
        }
    }


    fn.clickHandler = function(event) {
        const {type} = event.target.dataset
        if (type === 'input' || type === 'value' || type === 'arrow') {
            this.toggle()
        } else if (type === 'item') {
            //console.log('event.target', event.target)
            const id = event.target.dataset.id
            // console.log('this')
            this.choose(id)
        } else if (type === 'backdrop') {
            this.close()
        }
    }


    fn.isOpen = function() {
        return this.select.classList.contains('open')
    }


    fn.current = function()  {
        return this.data.find(el => el.id === this.selectedId)
    }


    fn.choose = function(id) {
        this.selectedId = id
        this.$value.textContent = this.current().value
        this.close()
        this.select.querySelectorAll('[data-type="item"]').forEach(el => {
            el.classList.remove('selected')
        })
        this.select.querySelector(`[data-id="${id}"]`).classList.add('selected')
        // console.log('this.current', this.current);
        this.inputHidden.value = this.current().value
        this.options.onSelect(this.current())
        //this.options.onSelect() ? this.options.onSelect(this.current()) : null
        this.close()
    }


    fn.toggle = function() {
        this.isOpen() ? this.close() : this.open()
    }


    fn.open = function() {
        this.select.classList.add('open')
    }


    fn.close = function() {
        this.select.classList.remove('open')
    }


    fn.destroy = function() {
        this.select.removeEventListener('click', this.clickHandler)
        this.select.innerHTML = ''
    }


    fn.generateArrayObjects = function(e) {
        // console.log('e', e)
        const items = [...e.querySelectorAll('[data-type="item"]')]
        const arrayObjects = items.map((item,index) => {
            item.dataset.id = (index + 1).toString()
            return {
                id: item.dataset.id,
                value: item.textContent
            }
        });
        return arrayObjects
    }


})()



