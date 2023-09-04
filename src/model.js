let fns = require("date-fns");

const model = (function(){ 

    const fileOperator = {
        
        add(file) {
            file.parent = this;
            return this.children.push(file);
        },

        remove(file) {
            const childIndex = this.children.indexOf(file);
            if (childIndex !== -1)
                this.children.splice(childIndex, 1);
        },
        move(file){

        }

    }     
/*
    // File Types
    const makeStack  = function(name){
        // children can be stacks and books
        let children = [];
        
        const stack = {
            name,
            children,
            ...fileOperator,
            makeBook,        
            getType : ()  => "stack",
        }
        this.add(stack);
        return stack;
    }
*/
    let refBookID = -1;
    let refNoteID = -1;
    let bookList = [];
    const makeBook = function(name){
        let children = []; 
        const book = {
            name : name,
            setName: function (newName) { 
                this.name = newName; 
                return this.name;
              },
            id: ++refBookID, 
            children, 
            ...fileOperator,
            makeBook,
            makeNote,
            makeTodo,
            getType : ()  => "book",
        }
        this.add(book);
        bookList.push(book);
        return book;
    }
    
    

    const defaultBook = {
        name : "Memobooks",
        id: ++refBookID, 
        children : [],
        ...fileOperator,
        makeBook,        
        getType : ()  => "book",
    };
    const defaultNotes = {
        name : "Notes",
        id:"N",
        children : [],
        ...fileOperator,
        getType : () => "book",
    }
    
    const defaultTodos = {
        name : "Todo",
        id:"T",
        children : [],
        ...fileOperator,
        getType : () => "book",
    }

    bookList.push(defaultBook, defaultNotes, defaultTodos);

    let openedBook = defaultBook;
    let focusBook;

    const getBookFromID = function(bookID){
        return bookList.find(book => bookID == book.id);  
    }
    const getOpenedBookFromID = function(clickedBookID){
        openedBook = getBookFromID(clickedBookID);
        
        return openedBook;
    };

    const noteMix = function(name, content){
        const creationDate = new Date();
        const editNote = function(text){content = text};
        return {
            name,
            id: ++refNoteID,
            creationDate,
            formattedCreationDate : {
                date : creationDate.toLocaleDateString(), 
                time : creationDate.toLocaleTimeString()
            },
            content,
            editNote,
        }
    };

    const makeNote = function(name, content = ""){ 
        const note = {
            ...noteMix(name, content),      
            getType : () => "note",
        }
        this.add(note);
        defaultNotes.children.push(note);
        return note;
    }

    const makeTodo = function(name, content = "", dueDate, status = "Ongoing"){
        const tasks = [];
        const addTask = function(content){
            tasks.push({
                content,
                checked : false,
            });
        }

        const removeTask = function(content){
            tasks.splice(tasks.indexOf(content), 1);
        } 

        const getStatus = function(){
            if(status != "Done"){
                let daysLeft = fns.differenceInCalendarDays(dueDate, new Date());
                switch(true){
                    case (daysLeft == 0) : return "Today"; break;
                    case (daysLeft == 1) : return "Tomorrow"; break;
                    case (daysLeft < 0) : return "Overdue"; break;
                    default : return daysLeft + " days left"; break;
                }
            }
            else return status;
        }
        const updateTasksStatus = function(){
            tasks.forEach(task =>{
                if(!task.checked){
                    return;
                }
            })
            status = "Done";
        }

        const setDone = function(isDone){
            if(isDone){
                status = "Done";
                tasks.forEach(task => task.checked = true);
            }
            else {
                status = "Ongoing";
                tasks.forEach(task => task.checked = false);
                this.updateStatus();
        };
           
        

        } 
    
        const todo = {
            ...noteMix(name, content),
            dueDate,
            getStatus,
            updateTasksStatus,
            setDone,
            tasks,
            addTask,
            removeTask,
            getType : ()  => "todo",
        };

        this.add(todo);
        defaultTodos.children.push(todo);
        return todo;
        
    } 
    
    // end

    
    
    return{
        defaultBook,
        defaultNotes,
        defaultTodos,
        bookList,
        openedBook,
        focusBook,
        getBookFromID,
        getOpenedBookFromID,
        debugVar : "", 
    }
    
})();

export {model};