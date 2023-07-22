let cl = console.log;

// let testConfirm = confirm(`Are you sure, You want to delete ${deletedValue} from todo list`)

const todoForm = document.getElementById('todoForm');
const toDoItem = document.getElementById('toDoItem');
const todoList = document.getElementById('todoList');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteAll = document.getElementById('deleteAll')
let todoListArr = JSON.parse(localStorage.getItem('todoListArr')) || [];

// let todoListArr = []

function UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

const onItemEdit = (ele) => {
  let editId = ele.getAttribute('data-id');

  let editObj = todoListArr.find((todo) => {
    return todo.skillId === editId
  })
  localStorage.setItem('editObj', JSON.stringify(editObj));
  updateBtn.classList.remove('d-none');
  addBtn.classList.add('d-none');
  toDoItem.value = editObj.skillName;
}

const onItemDelete = (ele) => {
  // let deleteId = ele.getAtrribute('data-id');
  let deleteId = ele.dataset.deleteid;
  let deletedValue = document.getElementById(deleteId).firstElementChild.innerHTML;
  let confirmDelete = confirm(`Are you sure`)

  if (confirmDelete) {
    todoListArr = todoListArr.filter(item => {
      return item.skillId !== deleteId
    })

    localStorage.setItem('todoListArr', JSON.stringify(todoListArr))

    document.getElementById(deleteId).remove()

    // swal.fire({
    //     icon: 'success',
    //     timer: 3000
    // })

    Swal.fire({
      title: `${deletedValue} is deleted from todo list`,
      title: 'Are you sure?',
      text: "permanently deleted",
      icon: 'warning',
      timer: 5000,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  } else {
    return false;
  }
}

const templating = (arr) => {
  let result = '';
  arr.forEach(item => {
    result += ` 
                    <li class="list-group-item font-weight-bold align-items-center d-flex justify-content-between" id="${item.skillId}">
                    <span>${item.skillName}</span>
                    <span>
                       <i class="fa-solid fa-plus  fa-flip mr-3 edit" 
                       onclick = "onItemEdit(this)"
                       data-id = "${item.skillId}"></i>

                       <i class="fa-regular fa-trash-can fa-bounce delete"
                       onclick = "onItemDelete(this)"
                       data-deleteId = "${item.skillId}"></i>
                    </span>
                     </li>

                  
                   `
  });
  todoList.innerHTML = result;
}

templating(todoListArr)

const onTodoAdd = (eve) => {
  eve.preventDefault();
  let skill = toDoItem.value;
  let todoObj = {
    skillName: skill,
    skillId: UUID()
  }
  todoListArr.unshift(todoObj)
  localStorage.setItem('todoListArr', JSON.stringify(todoListArr))
  eve.target.reset()

  let li = document.createElement("li");
  li.id = todoObj.skillId
  li.className = "list-group-item font-weight-bold align-items-center d-flex justify-content-between"
  li.innerHTML = `<span>${todoObj.skillName}</span>

                    <span>
                        <i class="fa-solid fa-plus fa-flip mr-3 edit" 
                         onclick = "onItemEdit(this)"
                        data-id = "${todoObj.skillId}"></i>

                        <i class="fa-regular fa-trash-can fa-bounce delete"
                        onclick = "onItemDelete(this)"
                        data-deleteId = "${todoObj.skillId}"></i>
                     </span>
    
                     
                     
                    `

  todoList.prepend(li)
  // Swal.fire({
  //     icon: 'success',
  //     timer: 3000
  // })
  Swal.fire({
    text: `${todoObj.skillName} added successfully `,
    position: 'top-end',
    icon: 'success',
    title: 'Your list has been saved',
    showConfirmButton: false,
    timer: 5000
  })
}

const onItemUpadate = () => {
  let updateValue = toDoItem.value;
  let editedObj = JSON.parse(localStorage.getItem('editObj'));

  for (let i = 0; i < todoListArr.length; i++) {
    if (todoListArr[i].skillId === editedObj.skillId) {
      todoListArr[i].skillName = updateValue
      break;
    }
  }
  localStorage.setItem('todoListArr', JSON.stringify(todoListArr))

  let targetLi = document.getElementById(editedObj.skillId)
  todoForm.firstElementChild.innerHTML = updateValue
  // Swal.fire({
  //     icon: 'success',
  //     timer: 3000
  // })

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    text: `${editedObj.skillName} is updated to ${updateValue}`,
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, update it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'updated!',
        'Your file has been updated.',
        'success'
      )
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelled',
        'Your file is safe :)',
        'error'
      )
    }
  })

  todoForm.reset()
  updateBtn.classList.add('d-none')
  addBtn.classList.remove('d-none')
}

const onclearAll = () => {
  // todoListArr.length = 0
 todoListArr.splice(0)
  localStorage.setItem('todoListArr', JSON.stringify(todoListArr))
  templating(todoListArr)

  Swal.fire({
    title: 'Are you sure?',
    text: "permanently deleted",
    icon: 'warning',
    timer: 5000,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
}



todoForm.addEventListener('submit', onTodoAdd)
updateBtn.addEventListener('click', onItemUpadate)
deleteAll.addEventListener('click', onclearAll)











































































