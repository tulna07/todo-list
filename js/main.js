import Services from "./services.js";
import Task from "./task.js";

const getElem = id => document.getElementById(id);
window.getElem = getElem;

const services = new Services(
  "https://625bc0d1398f3bc782ae7e06.mockapi.io/api/task/"
);

const renderHTML = data => {
  const { todo, completed } = data.reduce(
    (content, task) => {
      if (!task.isCompleted) {
        content.todo += `
          <li>
            ${task.content} 
            <div class="buttons">
              <button class="remove" onclick="deleteTask(${task.id})">
                <i class="fa-solid fa-trash-can"></i>
              </button>
              <button class="complete" onclick="updateTaskStatus(${task.id}, '${task.content}')">
                <i class="fa-solid fa-circle-check"></i>
              </button>
            </div>
          </li>
        `;
        return content;
      }

      content.completed += `
        <li>
          ${task.content} 
          <div class="buttons">
            <button class="remove" onclick="deleteTask(${task.id})">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            <button class="complete">
              <i class="fa-solid fa-circle-check"></i>
            </button>
          </div>
        </li>
      `;
      return content;
    },
    {
      todo: "",
      completed: "",
    }
  );

  getElem("todo").innerHTML = todo;
  getElem("completed").innerHTML = completed;
};
window.renderHTML = renderHTML;

const getTaskList = () =>
  services
    .fetchData()
    .then(response => renderHTML(response.data))
    .catch(err => {
      console.log(err);
      renderHTML([]);
    });
window.getTaskList = getTaskList;
getTaskList();

const deleteTask = id =>
  services
    .deleteData(id)
    .then(() => getTaskList())
    .catch(err => console.log(err));
window.deleteTask = deleteTask;

getElem("addItem").addEventListener("click", () => {
  const taskContent = getElem("newTask").value;
  const task = new Task(taskContent);
  services
    .addData(task)
    .then(() => {
      getTaskList();
      getElem("newTask").value = "";
    })
    .catch(err => console.log(err));
});

const updateTaskStatus = (id, content) => {
  services
    .updateData(id, { content, isCompleted: true })
    .then(() => getTaskList())
    .catch(err => console.log(err));
};
window.updateTaskStatus = updateTaskStatus;
