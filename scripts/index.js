import '../styles/index.scss';
import {v4 as uuidv4} from "uuid";

let db;

function init() {
    const isDB = issetDB();
    if(!isDB) {
        db = [
            {
            name: "Default list",
            uuid: uuidv4(),
            active: "false",
            todos: [{
                name: "Refactor my projects",
                dueDate: "14-02-2020",
                desc: "Get rid of this freaking spaghetti code and make something properly",
                uuid: uuidv4(),
                done: "false",
                prio: "low"
            },{
                name: "Todo number  2",
                dueDate: "02-04-2021",
                desc: "Whatever",
                uuid: uuidv4(),
                done: "false",
                prio: "high"
            },{
                name: "Schedule a haircut",
                dueDate: "05-07-2020",
                desc: "Blah blah blah",
                uuid: uuidv4(),
                done: "false",
                prio: "medium"
            },{
                name: "Evening workout",
                dueDate: "08-02-2023",
                desc: "FLEX YOUR MUSCLES OK",
                uuid: uuidv4(),
                done: "false",
                prio: "low"
            },{
                name: "There goes todo name",
                dueDate: "08-02-2023",
                desc: "Aaand there is a description",
                uuid: uuidv4(),
                done: "false",
                prio: "low"
            }]
            },
        ];
        localStorage.setItem('lists', JSON.stringify(db));
    }
    db = JSON.parse(localStorage.getItem('lists'));

    setButtonListeners();

    if(db[0]) db[0].active = "true";
    let firstTime = true;
    render(firstTime);
}

function issetDB() {
    if(localStorage.getItem('lists') == null || JSON.parse(localStorage.getItem('lists')).length === 0) return false;
    return true;
}

function setButtonListeners() {
    const addListBtn = document.querySelector('.add.list');
    const addTodoBtn = document.querySelector('.add.todo');
    addListBtn.addEventListener('click', addList);
    addTodoBtn.addEventListener('click', addTodo);
}

function removeList(list) {
    const currListID = db.findIndex(el => el.uuid === list.uuid);

    if(currListID !== -1) db.splice(currListID, 1);

    localStorage.setItem('lists', JSON.stringify(db));

    render(false);

    document.querySelector('.todos').innerHTML = '';
    if(db[currListID] !== undefined) {
        showTodos(db, db[currListID]);
    } else {
        showTodos(db, db[0]);
    }
}

function addList() {
    const modal = document.querySelector('.backdrop');
    modal.classList.add('on');
    modal.querySelector('#submit').value = "ADD";

    const form = document.querySelector('#form-list');
    form.classList.remove('hidden');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const name = form.querySelector('#name').value;
        if (!name) name = 'Default name';

        form.querySelector('#name').value = '';

        db.forEach((el) => el.active = "false");

        const newList = {
            name: name,
            uuid: uuidv4(),
            active: 'true',
            todos: [],
        };

        db.push(newList);

        localStorage.setItem('lists', JSON.stringify(db));

        modal.classList.remove('on');

        form.classList.add('hidden');

        render(db, false);

        showTodos(db, db[db.length - 1]);
    });

    modal.addEventListener('click', function(event) {
        if(event.target.classList.contains('backdrop')) {
            modal.classList.remove('on');
            form.classList.add('hidden');
        }
    });
}

function addTodo() {
    const modal = document.querySelector('.backdrop');
    modal.classList.add('on');
    modal.querySelector('#submit').value = "ADD";

    const form = modal.querySelector('#form-todo');
    form.classList.remove('hidden');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        let name = form.querySelector('#name').value;
        const prio = form.querySelector('#prio').value;
        let dueDate = form.querySelector('#due-date').value;
        let desc = form.querySelector('#desc').value;

        if(!name) name = 'Default name';
        if(!dueDate) dueDate = new Date(Date.now()).toLocaleDateString('en-CA').split(',')[0];
        if(!desc) desc = 'Default description';

        form.querySelector('#name').value = '';
        form.querySelector('#prio').value = 'low';
        form.querySelector('#due-date').value = '';
        form.querySelector('#desc').value = '';

        const currListID = db.findIndex(list => list.active === "true");

        db[currListID]['todos'].push({
            name,
            dueDate,
            desc,
            uuid: uuidv4(),
            done: "false",
            prio,
        });

        localStorage.setItem('lists', JSON.stringify(db));

        modal.classList.remove('on');

        form.classList.add('hidden');

        showTodos(db, db[currListID]);
    });

    modal.addEventListener('click', function(event) {
        if(event.target.classList.contains('backdrop')) {
            modal.classList.remove('on');
            form.classList.add('hidden');
        }
    });
}

function render(firstTime) {
    const listsDiv = document.querySelector('.lists');
    listsDiv.innerHTML = '';

    db.forEach((list, id, listsArr) => {
        const template = document.getElementById('list-template');
        const clonedTemplate = template.content.cloneNode(true);
        const name = clonedTemplate.querySelector('.list__name');
        const removeBtn = clonedTemplate.querySelector('.list__remove');

        name.textContent = list.name;

        const listTitle = document.querySelector('.list-title');
        listTitle.textContent = list.name;
        
        name.addEventListener('click', showTodos.bind(event, listsArr, list));
        removeBtn.addEventListener('click', removeList.bind(event, list));

        listsDiv.append(clonedTemplate);
    });

    if (firstTime === true) showTodos(db, db[0]);
    firstTime = false;
}

function showTodos(listsArr, list) {
    if(list !== undefined) {
        listsArr.forEach((el) => el.active = "false");
        list.active = "true";
    }

    const todos = document.querySelector('.todos');
    const modal = document.querySelector('.backdrop');
    todos.innerHTML = '';

    const listTitle = document.querySelector('.list-title');
    console.log(list);
    if(list != undefined) {
        listTitle.textContent = list.name;
    } else {
        listTitle.textContent = "No list.. :(";
    }

    if(list !== undefined) {
        list.todos.forEach((todo, id, listArr) => {
            const template = document.getElementById('todo-template');
            const clonedTemplate = template.content.cloneNode(true);
            const name = clonedTemplate.querySelector('.todo__name');
            const dueDate = clonedTemplate.querySelector('.todo__due-date');
            const desc = clonedTemplate.querySelector('.todo__desc');
            const prio = clonedTemplate.querySelector('.todo__prio');
            const doneBox = clonedTemplate.querySelector('.todo__done-box');
            const todoDiv = clonedTemplate.querySelector('.todo');
            const removeBtn = clonedTemplate.querySelector('.todo__remove');
        
            name.textContent = todo.name;
            dueDate.textContent = todo.dueDate;
            desc.textContent = todo.desc;
            prio.classList.add(todo.prio);
        
            crossTodo(todo, todoDiv, false);
        
            removeBtn.addEventListener('click', removeTodo.bind(event, todo, listsArr));
            name.addEventListener('click', editTodo.bind(event, todo, listsArr, listArr, modal));
            doneBox.addEventListener('click', toggleTodo.bind(event, todo, todoDiv));
        
            todos.append(clonedTemplate);
            });
    }
}

function crossTodo(todo, todoDiv, toggle = "false") {
    todoDiv.querySelector('.todo__done-box').classList.remove('done');
    todoDiv.querySelector('.todo__name').style.textDecoration = "none";
    todoDiv.querySelector('.todo__due-date').style.textDecoration = "none";
    todoDiv.querySelector('.todo__desc').style.textDecoration = "none";
    if (toggle === "true") todo.done = todo.done === "false" ? "true" : "false";
    if (todo.done === "true") {
        todoDiv.querySelector('.todo__done-box').classList.add('done');
        todoDiv.querySelector('.todo__name').style.textDecoration = "line-through";
        todoDiv.querySelector('.todo__due-date').style.textDecoration = "line-through";
        todoDiv.querySelector('.todo__desc').style.textDecoration = "line-through";
    }
}

function toggleTodo(todo, todoDiv) {
    todoDiv.querySelector('.todo__done-box').classList.toggle('done');
    crossTodo(todo, todoDiv, "true");
}
 
function editTodo(todo, lists, list, modal) {
    modal.classList.add('on');
    modal.querySelector('#submit').value = "EDIT";
    const form = modal.querySelector('form');
    form.classList.remove('hidden');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = form.querySelector('#name').value;
        const prio = form.querySelector('#prio').value;
        const dueDate = form.querySelector('#due-date').value;
        const desc = form.querySelector('#desc').value;

        todo.name = name;
        todo.prio = prio;
        todo.dueDate = dueDate;
        todo.desc = desc;

        modal.classList.remove('on');

        const currListID = lists.findIndex(list => list.active === "true");

        form.classList.add('hidden');

        localStorage.setItem('lists', JSON.stringify(db));

        showTodos(lists, lists[currListID]);
    });

    modal.addEventListener('click', function(e) {
        if(event.target.classList.contains('backdrop')) {
            modal.classList.remove('on');
            form.classList.add('hidden');
        }    
    });
}

function removeTodo(todo, lists) {
    const currListID = lists.findIndex(list => list.active === "true");

    for (let i = 0; i < lists.length; i++) {
        if (lists[i].active === "true") {
            lists[i].todos = lists[i].todos.filter((el) => el.uuid !== todo.uuid);
            localStorage.setItem('lists', JSON.stringify(db));
        }
    }

    showTodos(lists, lists[currListID]);
}

init();