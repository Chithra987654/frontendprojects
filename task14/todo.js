const username = localStorage.getItem('username') || 'User';
document.getElementById('welcome').textContent = `Welcome, ${username}`;

const todoList = document.getElementById('todo-list');
let todos = [];

function fetchTodos() {
  const api = new XMLHttpRequest();
  api.open('GET', 'https://jsonplaceholder.typicode.com/todos');
  api.send();
  api.onreadystatechange = function () {
    if (api.readyState === 4 && api.status === 200) {
      todos = JSON.parse(api.responseText).slice(0, 5); // first 5 tasks
      renderTodos();
    }
  };
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = `
      <span><input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTask(${index})"> ${todo.title}</span>
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
    `;
    todoList.appendChild(li);
  });
  updateProgress();
}

function addTask() {
  const newTaskInput = document.getElementById('new-task');
  const title = newTaskInput.value.trim();
  if (title) {
    todos.push({ title, completed: false });
    newTaskInput.value = '';
    renderTodos();
  }
}

function toggleTask(index) {
  todos[index].completed = !todos[index].completed;
  renderTodos();
}

function deleteTask(index) {
  todos.splice(index, 1);
  renderTodos();
}

function updateProgress() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const percent = total ? (completed / total) * 100 : 0;

  document.getElementById('progress').style.width = percent + '%';
  document.getElementById('task-count').textContent = `${completed} / ${total}`;

  if (total > 0 && completed === total) {
    launchConfetti();
  }
}

function logout() {
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

function launchConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    w: 5,
    h: 10,
    color: `hsl(${Math.random() * 360},100%,50%)`,
    speed: Math.random() * 3 + 2
  }));

  const start = Date.now();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      p.y += p.speed;
    });

    if (Date.now() - start < 2000) {
      requestAnimationFrame(draw); // animate for 2 seconds
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clear after 2s
    }
  }

  draw();
}



fetchTodos();
