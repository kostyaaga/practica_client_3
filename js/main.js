Vue.component('task-card', {
    props: ['task', 'columnIndex', 'moveTask', 'removeTask', 'columns'],
    data() {
        return {
            isEditing: false,
            editedTitle: this.task.title,
            editedDescription: this.task.description,
            editedDeadline: this.task.deadline
        };
    },
    computed: {
        taskClass() {
            return { 'completed-task': this.task.isCompleted };
        }
    },
    methods: {
        editTask() {
            this.isEditing = true;
        },
        saveTask() {
            this.task.title = this.editedTitle;
            this.task.description = this.editedDescription;
            this.task.deadline = this.editedDeadline;
            this.task.lastEdited = new Date().toLocaleString();
            this.isEditing = false;
        },
        moveTaskToNextColumn() {
            const nextColumnIndex = this.columnIndex + 1;
            if (nextColumnIndex < this.columns.length) {
                this.moveTask(this.task, nextColumnIndex);
            }
        },
        deleteTask() {
            this.removeTask(this.task, this.columnIndex);
        }
    },
    template: `
    <div class="task-card">
      <div v-if="!isEditing">
        <p><strong>{{ task.title }}</strong></p>
        <p>{{ task.description }}</p>
        <p>Deadline: {{ task.deadline }}</p>
        <p>Last Edited: {{ task.lastEdited }}</p>
        <button v-if="columnIndex!=3"  @click="editTask">Edit</button>
        <button v-if="columnIndex!=3" @click="moveTaskToNextColumn">Move to Next Column</button>
        <button v-if="columnIndex===0" @click="deleteTask">Delete</button>
      </div>
      <div v-else>
        <input v-model="editedTitle" placeholder="Title" />
        <textarea v-model="editedDescription" placeholder="Description"></textarea>
        <input type="date" v-model="editedDeadline" />
        <button @click="saveTask">Save</button>
      </div>
    </div>
  `
});

Vue.component('column', {
    props: ['columnTitle', 'tasks', 'columnIndex', 'moveTask', 'removeTask', 'isButton', 'columns'],
    methods: {
        addTask() {
            const newTask = {
                title: 'New Task',
                description: 'Task description...',
                deadline: new Date().toLocaleDateString(),
                lastEdited: new Date().toLocaleString()
            };
            this.tasks.push(newTask);
        },
    },
    template: `
    <div class="column">
      <h2>{{ columnTitle }}</h2>
      <div v-if="isButton">
        <button @click="addTask">Add Task</button>
      </div>
      <div v-for="(task, index) in tasks" :key="index">
        <task-card 
          :task="task" 
          :columnIndex="columnIndex" 
          :moveTask="moveTask" 
          :removeTask="removeTask" 
          :columns="columns"
        />
      </div>
    </div>
  `
});

new Vue({
    el: '#app',
    data() {
        return {
            columns: [
                { title: 'Planned Tasks', tasks: [], isButton: true },
                { title: 'Tasks in Progress', tasks: [], isButton: false },
                { title: 'Testing', tasks: [], isButton: false },
                { title: 'Completed Tasks', tasks: [], isButton: false }
            ]
        };
    },
    methods: {
        moveTask(task, nextColumnIndex) {
            const currentColumn = this.columns.find(column => column.tasks.includes(task));
            if (currentColumn) {
                currentColumn.tasks = currentColumn.tasks.filter(t => t !== task);
            }
            if (nextColumnIndex < this.columns.length) {
                this.columns[nextColumnIndex].tasks.push(task);
            }
            if (nextColumnIndex === 3) {
                this.onTaskCompleted(task);
            }
        },
        removeTask(task, columnIndex) {
            this.columns[columnIndex].tasks = this.columns[columnIndex].tasks.filter(t => t !== task);
        }
    },
    template: `
    <div class="board">
      <column
        v-for="(column, index) in columns"
        :key="index"
        :columnTitle="column.title"
        :isButton="column.isButton"
        :tasks="column.tasks"
        :columnIndex="index"
        :columns="columns"
        :moveTask="moveTask"
        :removeTask="removeTask"
      />
    </div>
  `
});
