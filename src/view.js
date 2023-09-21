const view = (function(){
    const templateBook = document.querySelector("#template-folder"); 
    const templateNote = document.querySelector("#template-note");
    const templateTodo = document.querySelector("#template-todo");
    const defaultBookNode = document.querySelector(".memobooks");
    const hierarchyNode = document.querySelector(".hierarchy");
    const bookNodeList = [];
    const openedBookNode = document.querySelector(".opened-book");
    let selectedBookNode;
    let _focusBookNode = "this";
    const noteListNode = document.querySelector(".note-list");
    let selectedNoteNode;
    const editorNode = document.querySelector(".editor");
    const bindAddBook = function(bookNode){
        bookNode.addEventListener("click", () => {

        });
    };

    // Book methods

    const loadBook = function(book, parentNode){
        //const parentNode = document.querySelector(parentSelector);
        
        const parentNodeList = parentNode.querySelector(".list"); 
        const bookNode = templateBook.content.cloneNode(true).firstElementChild;
       
        parentNodeList.appendChild(bookNode);
         
        bookNode.querySelector(".folder-title .folder-title-text").value = book.name;
        bookNode.setAttribute("data-id", book.id);
        
         
        return bookNode;
    }
    const closeOldFolderMore = function(){
        const oldMore = defaultBookNode.querySelector(".folder-more.visible")
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
                bookNode.parentNode.removeChild(bookNode);
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
        console.log("- ".repeat(depth) + holder.name);
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
                        console.log("this is happening");
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
        
        while(noteListNode.firstElementChild) noteListNode.removeChild(noteListNode.firstElementChild);
        
        openedBookNode.querySelector(".opened-book-title > h2").textContent = selectedBook.name;
        
        selectedBook.children.forEach((child) => {
            
            if(child.getType() != "book"){
                const noteNode = (child.getType() == "note") ? loadNote(child) : loadTodo(child); 
                noteListNode.appendChild(noteNode);
            }
            
        });  
        openedBookNode.dataset.id = selectedBook.id;
    }

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
        todoNode.dataset.id = todo.id;
        
        return todoNode;
    }
    const setEditNote = function(note){
        editorNode.querySelector(".editor-note-name").value = note.name;
        editorNode.querySelector(".editor-text").textContent = note.content;
        editorNode.dataset.id = note.id;
        editorNode.classList.add("visible");
    }

    const catchEditNote = function(handler){
        openedBookNode.addEventListener("click", (e) =>{
            if(e.target.closest(".note")){
                const noteNode = e.target.closest(".note");
                selectedNoteNode = noteNode;
                const note = handler(noteNode.dataset.id);
            }
        });
        openedBookNode.addEventListener("dblclick", (e) =>{
            if(e.target.closest(".note")){
                const noteNode = e.target.closest(".note");
                selectedNoteNode = noteNode;
                const note = handler(noteNode.dataset.id);
                setEditNote(note);          
            }
        });
    };
    
    const catchAddNote = function(handler){
        openedBookNode.addEventListener("click", (e)=>{
            if(e.target.closest(".add-note")){
                const {newNote, selectedBook} = handler(); 
                loadBookNotes(selectedBook);
                setEditNote(newNote);
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
    const catchDeleteNote = function(handler){
        openedBookNode.addEventListener("click", (e)=>{
            if(e.target.closest(".file-delete") && selectedNoteNode){
                handler(selectedNoteNode.dataset.id)        
                noteListNode.removeChild(selectedNoteNode);
                selectedNoteNode = null;
                editorNode.classList.remove("visible");
            }
        });
    }

    const catchTodoCheck = function(todoCheckHandler){
        openedBookNode.addEventListener("click", (e) =>{
            
            if(e.target.closest(".note-check")){
                e.stopPropagation();
                console.log("Clicked");
                const todoNode = e.target.closest(".todo");
                const statusNode = todoNode.querySelector(".note-status");
                const todoID  = todoNode.dataset.id;
                const status = todoCheckHandler(todoID);
                
                statusNode.textContent = status;
                todoNode.classList.toggle("checked");
                
            }
        });
    }
    const updateTodoStatus = function(statusGetter){
        const seconds = 5;
        setInterval(() =>{
        
            const todoNodes = openedBookNode.querySelectorAll(".todo");
            todoNodes.forEach(todoNode => {
                const todoID = todoNode.dataset.id;
                todoNode.querySelector(".note-status").textContent = statusGetter(todoID);
            });
        }, seconds * 1000);
            
    }

    


    


    return {
        showHierarchy,
        catchMoreBook,
        loadBook,
        loadBookHierarchy,
        setOpenedBook,
        loadBookNotes,
        catchEditNote,
        catchAddNote,
        catchDeleteNote,
        catchTodoCheck,
        updateTodoStatus,
        setBookCollapsing,
        enableEditBookName,
        setEditBookName,


        set focusBookNode(value){_focusBookNode = value;},
        get focusBookNode(){return _focusBookNode},
        
        
    }
    
})();

export {view};