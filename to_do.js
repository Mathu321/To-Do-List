let tasks = [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter');

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now(), text, completed: false });

    taskInput.value = '';
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    render();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    render();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    render();
}

function getFiltered() {
    if (currentFilter === 'active') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
}

function render() {
    const visible = getFiltered();
    if (visible.length === 0) {
        taskList.innerHTML = '<p class="empty">No tasks here!</p>';
    } else {
        taskList.innerHTML = visible
            .map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <input type="checkbox" ${task.completed ? 'checked' : ''} />
          <span class="task-text">${task.text}</span>
          <button class="delete-btn">✕</button>
        </li>
      `)
            .join('');
    }
    const remaining = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`;
    document.querySelectorAll('.task-item').forEach(item => {
        const id = Number(item.dataset.id);
        item.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTask(id));
        item.querySelector('.delete-btn').addEventListener('click', () => deleteTask(id));
    });
}
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render();
    });
});
render();