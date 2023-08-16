const view = (function(){
    const templateBook = document.querySelector("#template-folder"); 
    const defaultBookNode = document.querySelector(".memobooks");
    const bindAddBook = function(bookNode){
        bookNode.addEventListener("click", () => {

        });
    };
    const createBook = function(book, parentSelector){
        const parentNode = document.querySelector(parentSelector);
        const bookNode = templateBook.content.cloneNode(true).firstElementChild;
        console.log(bookNode); 
        parentNode.appendChild(bookNode);
        
        bookNode.querySelector(".folder-title span").textContent = book.name;
        
         
        return bookNode;
    }
    const setBookCollaspe = function(book){
        
        book.addEventListener("click", (e)=>{
            e.stopPropagation();
            book.classList.toggle("collasped");
        });     
    };

    const showHierarchy = function(holder, depth = 0){
        console.log("- ".repeat(depth) + holder.name);
        if(holder.children && holder.children.length){   
            holder.children.forEach(child =>{
                showHierarchy(child, depth + 1);
            })
        }    
    }

    const initBooksCollaspe = (function(){
        document.querySelectorAll(".folder").forEach((book) => setBookCollaspe(book));
    })();

    return {
        showHierarchy,
        createBook,
    }
    
})();

export {view};