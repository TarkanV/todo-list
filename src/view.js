const view = (function(){
    const templateBook = document.querySelector("#template-folder"); 
    const templateNote = document.querySelector("#template-note");
    const templateTodo = document.querySelector("#template-todo");
    const defaultBookNode = document.querySelector(".memobooks");
    const bookNodeList = [];
    const openedBookNode = document.querySelector(".opened-book");
    const noteListNode = document.querySelector(".note-list");
    const bindAddBook = function(bookNode){
        bookNode.addEventListener("click", () => {

        });
    };
    const createBook = function(book, parentNode, bookList){
        //const parentNode = document.querySelector(parentSelector);
        const parentNodeList = parentNode.querySelector(".list"); 
        const bookNode = templateBook.content.cloneNode(true).firstElementChild;
        console.log(bookNode); 
        parentNodeList.appendChild(bookNode);
        
        bookNode.querySelector(".folder-title .folder-title-text").textContent = book.name;
        bookNode.setAttribute("data-id", book.id);
        if(book.children.length)
            setBookCollaspe(bookNode);
        loadBookNotes(bookNode, bookList);
         
        return bookNode;
    }

    

    const setBookCollaspe = function(bookNode){
        const icon = bookNode.querySelector(".expand-icon");
        icon.addEventListener("click", (e)=>{
            e.stopPropagation();
            bookNode.classList.toggle("collasped");
        });     
    };
    

    
    const loadBookHierarchy = function(book, bookNodeParent, bookList){
        if(book.children.length > 0){
            book.children.forEach((child) => {
                if(child.getType() == "book"){
                    const bookNode = createBook(child, bookNodeParent, bookList);
                    
                    loadBookHierarchy(child, bookNode, bookList);
                }
            });   
        }
    }
    const loadAllBooks = function(defaultBook, bookList){
        loadBookHierarchy(defaultBook, defaultBookNode, bookList);
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
    const loadBookNotes = function(clickedBookNode, bookList){

        clickedBookNode.addEventListener("click", (e) => {
            e.stopPropagation();
            const bookNodeID = clickedBookNode.dataset.id;
            console.log(bookNodeID);
            
            const openedBook = bookList.find(book => book.id == bookNodeID);

            if(clickedBookNode.childNodes.length){
                
                while(noteListNode.firstElementChild) noteListNode.removeChild(noteListNode.firstElementChild);
            }  
            openedBookNode.querySelector(".opened-book-title > h2").textContent = openedBook.name;
            openedBook.children.forEach((child) => {
                if(child.getType() != "book"){
                    const noteNode = (child.getType() == "note") ? loadNote(child) : loadTodo(child); 
                    noteListNode.appendChild(noteNode);
                }
                
            });

        })
    }

    const initBooksEvents = (function(){
        document.querySelectorAll(".folder").forEach((bookNode) => {
            setBookCollaspe(bookNode);

        });
    })();


    return {
        showHierarchy,
        loadAllBooks,
        createBook,
        
        
    }
    
})();

export {view};