const view = (function(){
    const templateBook = document.querySelector("#template-folder"); 
    const templateNote = document.querySelector("#template-note");
    const templateTodo = document.querySelector("#template-todo");
    const templateTask = document.querySelector("#template-task");
    const templateEditTask = document.querySelector("#template-editor-task");
    const defaultBookNode = document.querySelector(".memobooks");
    const hierarchyNode = document.querySelector(".hierarchy");
    const bookNodeList = [];
    const openedBookNode = document.querySelector(".opened-book");
    let selectedBookNode;
    let _focusBookNode = "this";
    const noteListNode = document.querySelector(".note-list");
    let selectedNoteNode;
    let openedNoteNode;
    const editorNode = document.querySelector(".editor");
    const editorStatus = document.querySelector(".editor-status > p");
    const editorTaskListNode =  editorNode.querySelector(".editor-task-list");
    let saveNoteDelay;
    const bindAddBook = function(bookNode){
        bookNode.addEventListener("click", () => {

        });
    };

    const removeNodeChildren = function(node){
        while(node.firstElementChild) node.removeChild(node.firstElementChild);
    }

    // Book methods

    const loadBook = function(book, parentNode){
        //const parentNode = document.querySelector(parentSelector);
        
        const parentNodeList = parentNode.querySelector(".list"); 
        const bookNode = templateBook.content.cloneNode(true).firstElementChild;
       
        parentNodeList.appendChild(bookNode);
         
        bookNode.querySelector(".folder-title .folder-title-text").value = book.name;
        bookNode.setAttribute("data-id", book.id);
        
    
        updateBookContentStatus(parentNode);
         
        return bookNode;
    }
    const updateBookContentStatus = function(bookNode){
        const hasSubFolders = bookNode.querySelector(".list").childNodes.length;
       
        if(!hasSubFolders) 
            bookNode.classList.add("empty");
        else bookNode.classList.remove("empty");
    }
    const closeOldFolderMore = function(){
        const oldMore = defaultBookNode.querySelector(".folder-more-tools.visible")
            if(oldMore){
                oldMore.classList.remove("visible");
            }
    }
    const catchMoreBook = function(addHandler, deleteHandler){
        defaultBookNode.addEventListener("click", (e) =>{
            
            closeOldFolderMore();

            if(e.target.closest(".show-folder-more")){
                
                const folderMore = e.target.closest(".show-folder-more").nextElementSibling;
                folderMore.classList.toggle("visible");
            }
            

            else if(e.target.closest(".add-folder")){
                const parentNode = e.target.closest(".folder");
                _focusBookNode = parentNode;
                const parentID = parentNode.dataset.id;
                const newBook = addHandler(parentID);
            } 
            else if(e.target.closest(".edit-folder")){
                const bookNode = e.target.closest(".folder");
                enableEditBookName(bookNode);
            }
            else if(e.target.closest(".delete-folder")){
                const bookNode = e.target.closest(".folder");
                const bookID = bookNode.dataset.id;
                deleteHandler(bookID);
                const parentBookNode = bookNode.parentNode.parentNode;
                bookNode.remove();
                updateBookContentStatus(parentBookNode);
                
            }
            
        });
    }
    const enableEditBookName = function(bookNode){
        const textNode = bookNode.querySelector(".folder-title-text");
        textNode.removeAttribute("readonly");
        bookNode.classList.toggle("title-edit");
    }
    
    const setEditBookName = function(handler){
        
        hierarchyNode.addEventListener("keyup", (e) =>{
            
            const textNode = e.target.closest(".folder-title-text");
            if(textNode){
                if(e.key == "Enter"){
                    
                    if(!textNode.getAttribute("readonly")){
                        const bookNode = textNode.closest(".folder");
                        const bookID = bookNode.dataset.id;
                        const newBookName = textNode.value;
                        handler(bookID, newBookName);
                        textNode.setAttribute("readonly", true);
                        bookNode.classList.remove("title-edit");
                    }
                }
            }    
        });
    }
        
    const loadBookHierarchy = function(book, bookNodeParent = defaultBookNode){
        if(book.children.length > 0){
            book.children.forEach((child) => {
                if(child.getType() == "book"){
                    const bookNode = loadBook(child, bookNodeParent);         
                    loadBookHierarchy(child, bookNode);
                }
            });   
        }
    }
    
    const showHierarchy = function(holder, depth = 0){
        
        if(holder.children && holder.children.length){   
            holder.children.forEach(child =>{
                showHierarchy(child, depth + 1);
            })
        }    
    }

    
    const setBookCollapsing = function(){
        
        hierarchyNode.addEventListener("click", (e)=>{
            if(e.target.closest(".expand-icon")){
                
                e.stopPropagation();
                const bookNode = e.target.parentNode.parentNode;
                bookNode.classList.toggle("collapsed");
            }
        });     
    };

    const setOpenedBook = function(handle){
        hierarchyNode.addEventListener("click", (e) => {
            
                if(e.target.closest(".folder-hoverer")){
                        // If previous selected book exist, toggle it off
                        
                        if(selectedBookNode) selectedBookNode.classList.toggle("selected");
                        selectedBookNode = e.target.closest(".folder");
                        selectedBookNode.classList.toggle("selected");

                        const selectedBookID = selectedBookNode.dataset.id;
                        

                        const selectedBook = handle(selectedBookID);
                        
                        loadBookNotes(selectedBook);
                        openedBookNode.dataset.id = selectedBook.id;
                    
                
            }
        })
    }


    
    // Notes methods
    const loadBookNotes = function(selectedBook){
        //const bookNodeID = selectedBookNode.dataset.id; 
        
        removeNodeChildren(noteListNode);
        
        openedBookNode.querySelector(".opened-book-title > h2").textContent = selectedBook.name;
        
        [...selectedBook.children].reverse().forEach((child) => {
            
            if(child.getType() != "book"){
                const noteNode = (child.getType() == "note") ? loadNote(child) : loadTodo(child); 
                noteListNode.appendChild(noteNode);
            }
            
        });  
        openedBookNode.dataset.id = selectedBook.id;
    }



    //Editor Part
    const loadNote = function(note){
        const noteNode = templateNote.content.cloneNode(true).firstElementChild;
        noteNode.querySelector(".note-name").textContent = note.name;
        noteNode.querySelector(".note-content").textContent = note.content;
        noteNode.querySelector(".note-date").textContent = note.formattedCreationDate.date;
        
        noteNode.dataset.id = note.id;
        
        return noteNode;
    }

    
    const loadTodo = function(todo){
        const todoNode = templateTodo.content.cloneNode(true).firstElementChild;
        todoNode.querySelector(".note-name").textContent = todo.name;
        todoNode.querySelector(".note-content").textContent = todo.content;
        todoNode.querySelector(".note-status").textContent = todo.getStatus();  
        console.log("Status = " + todo.getStatus());
        if(todo.getStatus() == "Done"){
            console.log("Loaded");
            todoNode.classList.add("checked");
        }
        todo.tasks.forEach((task) =>{
            const taskListNode = todoNode.querySelector(".task-list");
            const taskNode = templateTask.content.cloneNode(true).firstElementChild;
            taskNode.dataset.id = task.id;
            taskNode.querySelector(".task-content").textContent = task.content;
            taskNode.querySelector(".task-check").checked = task.checked;
            taskListNode.appendChild(taskNode);
        })
        todoNode.dataset.id = todo.id;
        
        return todoNode;
    }
    const loadEditTask = function(task){
            const taskNode = templateEditTask.content.cloneNode(true).firstElementChild;
            taskNode.dataset.id = task.id;
            taskNode.querySelector(".editor-task-content").textContent = task.content;
            editorTaskListNode.appendChild(taskNode);
    }
    const loadEditTasks = function(todo){
        todo.tasks.forEach((task) =>{
            loadEditTask(task);
        });
        }
    const loadEditNote = function(note){
        const noteType = note.getType();
        removeNodeChildren(editorTaskListNode);
        if(noteType == "todo"){
            editorNode.classList.add("edit-todo");
            editorNode.querySelector(".duedate").value = note.dueDate.toISOString().slice(0,16);
            console.log(note.dueDate);
            loadEditTasks(note);         
        }
        else editorNode.classList.remove("edit-todo");

        editorNode.querySelector(".editor-note-name").value = note.name;
        editorNode.querySelector(".editor-text").textContent = note.content;
        editorNode.dataset.id = note.id;
        editorNode.classList.add("visible");
        openedNoteNode = selectedNoteNode;
    }

    const catchAddTask = function(handler){
        editorNode.addEventListener("click", (e)=>{
            if(e.target.closest(".add-task")){
                const newTask = handler();
                loadEditTask(newTask);         
            }
        })
    }
    const catchDeleteTask = function(handler){
        editorNode.addEventListener("click", (e) =>{
            if(e.target.closest(".editor-task-delete")){
                const taskNode = e.target.closest(".editor-task-delete").parentNode;
                handler(taskNode.id);
            }
        })
    }

    //END

    const catchSelectedNote = function(handler){
        openedBookNode.addEventListener("click", (e) =>{
            const prevSelectedNoteNode = selectedNoteNode;
            if(e.target.closest(".note")){
                const noteNode = e.target.closest(".note");
                selectedNoteNode = noteNode;
                const note = handler(noteNode.dataset.id);
            }
            if(e.target.closest(".todo")){
                selectedNoteNode.querySelector(".task-list").classList.add("visible");
            }
            if(prevSelectedNoteNode && prevSelectedNoteNode != selectedNoteNode &&
                prevSelectedNoteNode.querySelector(".task-list")){
                prevSelectedNoteNode.querySelector(".task-list").classList.remove("visible");
            }
        });
        
    };
    const catchOpenedNote = function(handler){
        openedBookNode.addEventListener("dblclick", (e) =>{
            if(e.target.closest(".note-main") || e.target.closest(".todo-main")){
                console.log("CLOSEST");
                const noteNode = e.target.closest(".note");
                selectedNoteNode = noteNode;
                const note = handler(noteNode.dataset.id);
                loadEditNote(note);          
            }
        });
    }
    
    const catchAddNote = function(handler){
        openedBookNode.addEventListener("click", (e)=>{
            if(e.target.closest(".add-note") || e.target.closest(".add-todo")){
                let noteType;
                if(e.target.closest(".add-note")) noteType = "note";
                else if(e.target.closest(".add-todo")) noteType = "todo";
                const {newNote, selectedBook} = handler(noteType); 
                loadBookNotes(selectedBook);
                selectedNoteNode = noteListNode.childNodes[1];
                loadEditNote(newNote);
                noteListNode.scrollTop = -noteListNode.scrollHeight;
            }
            
            const moreOption = (function(){
                if(e.target.closest(".file-more-button")){
                    const fileMore = e.target.closest(".file-more-button").nextElementSibling;
                    fileMore.classList.toggle("visible");
                }
                
            })();
        });
        
    }



    const catchNoteEdition = function(noteSaver){
        editorNode.addEventListener("input", (e)=>{
        
        editorStatus.textContent = "Saving...";

        clearTimeout(saveNoteDelay); 

        saveNoteDelay = setTimeout(()=>{
            const newNoteName = editorNode.querySelector(".editor-note-name").value;
            const newNoteContent = editorNode.querySelector(".editor-text").textContent;
            const newTaskContentList = [];
            editorTaskListNode.childNodes.forEach(taskNode =>{
                if(taskNode.querySelector){
                    const content = taskNode.querySelector(".editor-task-content").textContent;
                    newTaskContentList.push(content);
                }
            })
            const newDueDate = editorNode.querySelector(".duedate").value;
            
            noteSaver(newNoteName, newNoteContent, newTaskContentList, newDueDate);
            editorStatus.textContent = "Note Saved!";
        
        },1000
        );

        });
    }

    


    const catchDeleteNote = function(handler){
        let transition = false;
        openedBookNode.addEventListener("click", (e)=>{
            console.log("Selected Note Node : ")
            console.log(selectedNoteNode);
            if(e.target.closest(".file-delete") && selectedNoteNode && !transition){
                
            
                console.log("Deleting Process");
                selectedNoteNode.classList.toggle("deleting");
                transition = true;
                selectedNoteNode.addEventListener("transitionend", (e) => {
                    
                    if(e.propertyName == "height"){
                        handler(selectedNoteNode.dataset.id);   
                        selectedNoteNode = e.target.parentNode.nextElementSibling;   
                        e.target.parentNode.remove();
                        
                        editorNode.classList.remove("visible");   
                        transition = false;
                    } 
                });  
                
            }
        });
    }

    const catchTodoCheck = function(todoCheckHandler){
        openedBookNode.addEventListener("click", (e) =>{
            
            if(e.target.closest(".note-check")){
                e.stopPropagation();
                
                const todoNode = e.target.closest(".todo");
                const statusNode = todoNode.querySelector(".note-status");
                const todoID  = todoNode.dataset.id;
                const status = todoCheckHandler(todoID);
                
                statusNode.textContent = status;
                todoNode.classList.toggle("checked");
                if(status != "Done"){
                   const taskCheckNodes = todoNode.querySelectorAll(".task-check");
                    taskCheckNodes.forEach((checkNode) => checkNode.checked = false);
                }
                else{
                    const taskCheckNodes = todoNode.querySelectorAll(".task-check");
                    taskCheckNodes.forEach((checkNode) => checkNode.checked = true); 
                }
                
            }
        });
    }
    const watchTodoStatus = function(statusGetter){
        const seconds = 5;
        setInterval(() =>{
        
            const todoNodes = openedBookNode.querySelectorAll(".todo");
            todoNodes.forEach(todoNode => {
                const todoID = todoNode.dataset.id;
                todoNode.querySelector(".note-status").textContent = statusGetter(todoID);
            });
        }, seconds * 1000);
            
    }

    const catchTaskCheck = function(handler){
        openedBookNode.addEventListener("click", (e) =>{
            if(e.target.closest("input.task-check")){
                const taskCheckNode = e.target.closest(".task-check");
                const taskNode = taskCheckNode.parentNode.parentNode;
                const todoStatus = handler(taskNode.dataset.id, taskCheckNode.checked);
                if(todoStatus == "Done"){
                    selectedNoteNode.querySelector(".note-status").textContent = todoStatus;
                    selectedNoteNode.classList.add("checked");
                }
                else{
                    selectedNoteNode.querySelector(".note-status").textContent = todoStatus;
                    selectedNoteNode.classList.remove("checked");  
                }
            }
        })
    }
    

    

    

    


    


    return {
        showHierarchy,
        catchMoreBook,
        loadBook,
        loadBookHierarchy,
        setOpenedBook,
        loadBookNotes,
        loadEditNote,
        catchAddTask,
        catchDeleteTask,
        catchSelectedNote,
        catchOpenedNote,
        catchAddNote,
        catchNoteEdition,
        catchDeleteNote,
        catchTodoCheck,
        watchTodoStatus,
        catchTaskCheck,
        setBookCollapsing,
        enableEditBookName,
        setEditBookName,


        set focusBookNode(value){_focusBookNode = value;},
        get focusBookNode(){return _focusBookNode},
        
        
    }
    
})();

export {view};