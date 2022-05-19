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

const getTaskList = async (
  { sort, ascending } = { sort: false, ascending: false }
) => {
  try {
    const response = await services.fetchData();
    const tasks = response.data;
    if (sort) {
      tasks.sort((a, b) => a["content"].localeCompare(b["content"]));
      if (!ascending) tasks.reverse();
    }

    renderHTML(tasks);
  } catch (err) {
    console.log(err);
    renderHTML([]);
  }
};
window.getTaskList = getTaskList;
getTaskList();

const deleteTask = async id => {
  try {
    await services.deleteData(id);
  } catch (err) {
    console.log(err);
  }

  getTaskList();
};
window.deleteTask = deleteTask;

getElem("addItem").addEventListener("click", async () => {
  const taskContent = getElem("newTask").value;
  const task = new Task(taskContent);

  try {
    await services.addData(task);
  } catch (err) {
    console.log(err);
  }

  getTaskList();
  getElem("newTask").value = "";
});

const updateTaskStatus = async (id, content) => {
  try {
    await services.updateData(id, { content, isCompleted: true });
  } catch (err) {
    console.log(err);
  }

  getTaskList();
};
window.updateTaskStatus = updateTaskStatus;

getElem("two").addEventListener("click", () => {
  getTaskList({ sort: true, ascending: true });
});

getElem("three").addEventListener("click", () => {
  getTaskList({ sort: true, ascending: false });
});
