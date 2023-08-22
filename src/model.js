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
            name,
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
        return note;
    }

    const makeTodo = function(name, content = "", dueDate = new Date(), status = "Ongoing"){
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

        const updateStatus = function(){
            if(status != "Done"){
                if(new Date().getTime() >= dueDate.getTime()){
                    status = "Overdue";
                }
                else{
                    status = "Ongoing";
                }
            }
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
            formattedDueDate : {
                date : dueDate.toLocaleDateString(), 
                time : dueDate.toLocaleTimeString()
            },
            updateStatus,
            updateTasksStatus,
            setDone,
            tasks,
            addTask,
            removeTask,
            getStatus : () => status,
            getType : ()  => "todo",
        };

        this.add(todo);
        return todo;
        
    } 
    
    // end

    
    
    return{
        defaultBook,
        bookList,
    }
    
})();

export {model};