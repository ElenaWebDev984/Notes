// date
const MAX_TITLE_LENGTH = 50;
const MESSAGE_DISPLAY_DURATION = 3000;

const colors = {
  yellow: 'var(--note-color1)',
  green: 'var(--note-color2)',
  blue: 'var(--note-color3)',
  red: 'var(--note-color4)',
  purple: 'var(--note-color5)',
};

const images = {
  noteDone: 'assets\images\Done.svg',
  noteMaxLengthError: 'assets\images\warning.svg',
  heartActive: 'assets\images\heartActive.svg',
  heartInactive: 'assets\images\heartInactive.svg',
  checkboxActive: 'assets\images\checkboxActive.svg',
  checkboxInactive:'assets\images\checkboxInactive.svg',
  deleteNotBtn: 'assets\images\trash.svg',
};

const messages = {
  alertNoteDone: 'Заметка добавлена!',
  alertMaxTitleLengthError: 'Максимальная длина заголовка - 50 символов',
  requiredBothFields: 'Оба поля должны быть заполнены',
};

// Модель данных
const model = {
    notes: [],
    isShowOnlyFavorite: false,

    // Загрузка заметок из localStorage
    loadNotes() {
        const savedNotes = localStorage.getItem('notes');
        this.notes = savedNotes ? JSON.parse(savedNotes) : [];
    },

    // Сохранение заметок в localStorage
    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    },

    // Добавление новой заметки
    addNote(title, content, color) {
        const note = {
            id: Date.now(), // Уникальный ID
            title,
            content,
            color,
            isFavorite: false,
        };
        this.notes.unshift(note); // Добавляем в начало массива
        this.saveNotes();
    },

    // Удаление заметки
    deleteNote(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId);
        this.saveNotes();
    },

    // Переключение избранного статуса
    toggleFavorite(noteId) {
        const note = this.notes.find((note) => note.id === noteId);
        if (note) {
            note.isFavorite = !note.isFavorite;
            this.saveNotes();
        }
    },

    // Переключение режима "Только избранные"
    toggleShowOnlyFavorite() {
        this.isShowOnlyFavorite = !this.isShowOnlyFavorite;
    },
};

// Представление (отображение данных)
const view = {
    // Инициализация
    init() {
        model.loadNotes();
        this.renderNotes();

        // Обработчики событий
        document.querySelector('.note-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddNote();
        });

        document.querySelector('.checkbox-filter').addEventListener('change', () => {
            model.toggleShowOnlyFavorite();
            this.renderNotes();
        });

        document.querySelector('.notes-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-button')) {
                const noteId = +e.target.closest('li').id;
                model.deleteNote(noteId);
                this.renderNotes();
            }

            if (e.target.classList.contains('favorite-button')) {
                const noteId = +e.target.closest('li').id;
                model.toggleFavorite(noteId);
                this.renderNotes();
            }
        });
    },

    // Обработка добавления заметки
    handleAddNote() {
        const title = document.querySelector('#note-title').value.trim();
        const content = document.querySelector('#description-text').value.trim();
        const color = document.querySelector('input[name="color"]:checked').value;

        if (!title || !content) {
            this.showMessage('Оба поля должны быть заполнены', false);
            return;
        }

        if (title.length > MAX_TITLE_LENGTH) {
            this.showMessage('Название слишком длинное', false);
            return;
        }

        if (content.length > MAX_CONTENT_LENGTH) {
            this.showMessage('Описание слишком длинное', false);
            return;
        }

        model.addNote(title, content, color);
        this.renderNotes();
        this.showMessage('Заметка добавлена!', true);

        // Очистка формы
        document.querySelector('#note-title').value = '';
        document.querySelector('#description-text').value = '';
    },

    // Отображение списка заметок
    renderNotes() {
        const notesList = document.querySelector('.notes-list ul');
        const notesToRender = model.isShowOnlyFavorite
            ? model.notes.filter((note) => note.isFavorite)
            : model.notes;

        if (notesToRender.length === 0) {
            notesList.innerHTML = `<li class="no-notes">У вас нет заметок</li>`;
            return;
        }

        // Генерация HTML для каждой заметки
        notesList.innerHTML = notesToRender
            .map(
                (note) => `
            <li id="${note.id}">
                <div class="note-wrapper" style="border-color: ${note.color}">
                    <div class="note-header">
                        <p class="note-title">${note.title}</p>
                        <div class="buttons-wrapper">
                            <button class="favorite-button">
                                ${note.isFavorite ? '★' : '☆'}
                            </button>
                            <button class="delete-button">🗑️</button>
                        </div>
                    </div>
                    <p class="note-content">${note.content}</p>
                </div>
            </li>`
            )
            .join('');
    },

    // Отображение сообщений
    showMessage(message, isSuccess) {
        const messagesBox = document.querySelector('.messages-box');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isSuccess ? 'success' : 'error'}`;
        messageElement.textContent = message;

        messagesBox.appendChild(messageElement);

        // Удаление сообщения через несколько секунд
        setTimeout(() => {
            messageElement.remove();
        }, MESSAGE_DISPLAY_DURATION);
    },
};

// Инициализация приложения
view.init();