const view = (function(){
    const templateBook = document.querySelector("#template-folder"); 
    const templateNote = document.querySelector("#template-note");
    const templateTodo = document.querySelector("#template-todo");
    const defaultBookNode = document.querySelector(".memobooks");
    const hierarchyNode = document.querySelector(".hierarchy");
    const bookNodeList = [];
    const openedBookNode = document.querySelector(".opened-book");
    let clickedBookNode;
    const noteListNode = document.querySelector(".note-list");
    const bindAddBook = function(bookNode){
        bookNode.addEventListener("click", () => {

        });
    };
    const createBook = function(book, parentNode){
        //const parentNode = document.querySelector(parentSelector);
        const parentNodeList = parentNode.querySelector(".list"); 
        const bookNode = templateBook.content.cloneNode(true).firstElementChild;
       
        parentNodeList.appendChild(bookNode);
         
        bookNode.querySelector(".folder-title .folder-title-text").textContent = book.name;
        bookNode.setAttribute("data-id", book.id);
        
         
        return bookNode;
    }


        
    const loadBookHierarchy = function(book, bookNodeParent = defaultBookNode){
        if(book.children.length > 0){
            book.children.forEach((child) => {
                if(child.getType() == "book"){
                    const bookNode = createBook(child, bookNodeParent);         
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

    const loadNote = function(note){
        const noteNode = templateNote.content.cloneNode(true).firstElementChild;
        noteNode.querySelector(".note-name").textContent = note.name;
        noteNode.querySelector(".note-content").textContent = note.content;
        noteNode.querySelector(".note-date").textContent = note.formattedCreationDate.date;
        return noteNode;
    }

    const loadTodo = function(todo){
        const todoNode = templateTodo.content.cloneNode(true).firstElementChild;
        todoNode.querySelector(".note-name").textContent = todo.name;
        todoNode.querySelector(".note-content").textContent = todo.content;
        todoNode.querySelector(".note-date").textContent = todo.formattedCreationDate.date;
        
        return todoNode;
    }


    const loadBookNotes = function(clickedBook){
        //const bookNodeID = clickedBookNode.dataset.id;
       
        
        
        while(noteListNode.firstElementChild) noteListNode.removeChild(noteListNode.firstElementChild);
        
        openedBookNode.querySelector(".opened-book-title > h2").textContent = clickedBook.name;
        
        clickedBook.children.forEach((child) => {
            
            if(child.getType() != "book"){
                const noteNode = (child.getType() == "note") ? loadNote(child) : loadTodo(child); 
                noteListNode.appendChild(noteNode);
            }
            
        });  
    }
    const catchClickedBook = function(handle){
        
    }
    const setOpenedBook = function(handle){
        hierarchyNode.addEventListener("click", (e) => {
            
                if(e.target.closest(".folder:not(.main-folder)") && !e.target.closest(".expand-icon")){
                    
                        clickedBookNode = e.target.closest(".folder");
                        const clickedBookID = clickedBookNode.dataset.id;
                        const clickedBook = handle(clickedBookID);
                    
                        loadBookNotes(clickedBook);
                    
                
            }
        })
    }

    const setBookCollapsing = function(){
        
        hierarchyNode.addEventListener("click", (e)=>{
            if(e.target.closest(".expand-icon")){
                e.stopPropagation();
                const bookNode = e.target.parentNode.parentNode.parentNode;
                bookNode.classList.toggle("collapsed");
            }
        });     
    };

    


    return {
        showHierarchy,
        createBook,
        loadBookHierarchy,
        setOpenedBook,
        loadBookNotes,
        setBookCollapsing,
        
        
    }
    
})();

export {view};