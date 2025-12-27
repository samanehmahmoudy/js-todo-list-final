const todoInput = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const todoList = document.querySelector('#todoList');
const statsDiv = document.querySelector('#stats');
const themeToggle = document.querySelector('#themeToggle');
const clearCompletedBtn = document.querySelector('#clearCompleted');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

const saveToLocal = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

const render = () => {
    todoList.innerHTML = ''; 
    let filteredTodos = todos;
    if (currentFilter === 'active') filteredTodos = todos.filter(t => !t.completed);
    if (currentFilter === 'completed') filteredTodos = todos.filter(t => t.completed);

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${todo.completed ? 'completed-item' : ''}`;
        
        const span = document.createElement('span');
        span.textContent = todo.text;
        span.className = todo.completed ? 'completed-text' : '';
        span.contentEditable = true;
        span.onblur = () => editTodo(todo.id, span.textContent); // ذخیره بعد از ویرایش

        
        const btnContainer = document.createElement('div');
        
        const doneBtn = document.createElement('button');
        doneBtn.textContent = '✅';
        doneBtn.className = 'btn btn-sm btn-light me-1';
        doneBtn.onclick = () => toggleTodo(todo.id); // 

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'btn btn-sm btn-light';
        deleteBtn.onclick = () => deleteTodo(todo.id); // [cite: 36, 37]

        btnContainer.append(doneBtn, deleteBtn);
        li.append(span, btnContainer);
        todoList.appendChild(li); // [cite: 27]
    });

    updateStats();
    saveToLocal();
};


const addTodo = () => {
    const text = todoInput.value.trim();
    if (!text) return alert("لطفاً متنی وارد کنید!"); 

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos = [...todos, newTodo];  
    todoInput.value = '';
    render();
};


const toggleTodo = (id) => {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    render();
};

// ۵. حذف با Filter 
const deleteTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    render();
};


const editTodo = (id, newText) => {
    todos = todos.map(t => t.id === id ? { ...t, text: newText } : t);
    saveToLocal();
};

// ۷. محاسبه آمار با Reduce (Bonus) 
const updateStats = () => {
    const completedCount = todos.reduce((acc, curr) => curr.completed ? acc + 1 : acc, 0);
    statsDiv.textContent = `${completedCount} مورد از ${todos.length} تسک تکمیل شده است.`;
};


document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        render();
    });
});


themeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

clearCompletedBtn.onclick = () => {
    todos = todos.filter(t => !t.completed);
    render();
};


addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });


if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
render();