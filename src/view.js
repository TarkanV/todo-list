const view = (function(){
    const templateBook = document.querySelector("#template-folder"); 
    const defaultBookNode = document.querySelector(".memobooks");
    const bindAddBook = function(bookNode){
        bookNode.addEventListener("click", () => {

        });
    };
    const createBook = function(book, parentNode){
        //const parentNode = document.querySelector(parentSelector);
        const parentNodeList = parentNode.querySelector(".list"); 
        const bookNode = templateBook.content.cloneNode(true).firstElementChild;
        console.log(bookNode); 
        parentNodeList.appendChild(bookNode);
        
        bookNode.querySelector(".folder-title span").textContent = book.name;
        bookNode.setAttribute("data-id", book.id);
    
        
         
        return bookNode;
    }
    const setBookCollaspe = function(bookNode){
        
        bookNode.addEventListener("click", (e)=>{
            e.stopPropagation();
            bookNode.classList.toggle("collasped");
        });     
    };

    
    const loadBookContent = function(book, bookNodeParent){
        if(book.children.length > 0){
            book.children.forEach((child) => {
                if(child.getType() == "book"){
                    const bookNode = createBook(child, bookNodeParent);
                    setBookCollaspe(bookNode);
                    loadBookContent(child, bookNode);
                }
            });   
        }
    }
    const loadAllBooks = function(defaultBook){
        loadBookContent(defaultBook, defaultBookNode);
    }

    const initBooksCollaspe = (function(){
        document.querySelectorAll(".folder").forEach((book) => setBookCollaspe(book));
    })();

    const showHierarchy = function(holder, depth = 0){
        console.log("- ".repeat(depth) + holder.name);
        if(holder.children && holder.children.length){   
            holder.children.forEach(child =>{
                showHierarchy(child, depth + 1);
            })
        }    
    }

    return {
        showHierarchy,
        loadAllBooks,
        createBook,
    }
    
})();

export {view};