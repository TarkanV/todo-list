
import {model} from "./model.js";
import {view} from "./view.js";

const fns = require("date-fns");

//Test Books
const myStack = model.defaultBook.makeBook("First Book");
const myBook = model.defaultBook.makeBook("Book 1");
myBook.makeNote("How to make a bomb", `- First take powder
- Spread that shit on your face
- Finish`,
)
 
let book1 = model.defaultBook.makeBook("Book 2");
book1.makeNote("The Enchanted Forest", "Amidst the whispering leaves, magical creatures roam.");
book1.makeNote("Echoes of Eternity", "A tale of time travel and cosmic secrets.");
book1.makeNote("Sapphire Skies", "A journey through dreamscapes and starlit realms.");
book1.makeNote("Crimson Chronicles", "Blood, betrayal, and the rise of a fallen hero.");
book1.makeNote("Whispers in the Wind", "Mysteries unfold with every breeze in a quaint village.");


//Note Sample
myBook.makeNote("Great Sailor", "The great sailor was a well known sailor who has conquered all the seas.");
let todo = myBook.makeTodo("Workout Time", `- Do 10 pushups 
- Eat healthy`, fns.add(new Date(), {days: -1, seconds: 200,}));
myBook.makeTodo("Red Light Therapy", "- Sit Still \n - Read Big Book \n - Deage :v", fns.add(new Date(), {days: 7,}));

myBook.makeNote("Chronicles of the Celestial Pirate", "A spacefaring rogue seeks treasure beyond the stars.");
myBook.makeNote("The Alchemist's Daughter", "Potions, destiny, and the power of a hidden lineage.");
myBook.makeNote("Eclipse of Empires", "Worlds collide as empires clash under an ancient prophecy.");
myBook.makeNote("Songbird's Lament", "The music that awakens magic and changes destinies.");
myBook.makeNote("Sands of Serendipity", "In the desert's embrace, a lost city reveals its secrets.");
myBook.makeBook("The Third Book Of the Guy");
//




const controller = (function(){
    const loadDefaultBook = function(book){
        model.openedBook = book;
        view.loadBookNotes(model.openedBook);
    }
    const loadAllBooks = function(){
        view.loadBookHierarchy(model.defaultBook);
    }
    const handleAddBook = function(bookID){
        const parentBook = model.getBookFromID(bookID);
        const newBook = parentBook.makeBook("New Book");
        //console.log(view.targetBook);
        const newBookNode = view.loadBook(newBook, view.targetBook);
        const textNode = newBookNode.querySelector(".folder-title-text")
        textNode.removeAttribute("readonly");
        newBookNode.classList.toggle("title-edit");
        textNode.addEventListener("keyup", (e) =>{
            if(e.key == "Enter"){
                if(!textNode.getAttribute("readonly")){
                    textNode.setAttribute("readonly", true);
                    newBookNode.classList.remove("title-edit");
                }
            
            }    
        });
        
    }

    const handleBookEvents = function(){
        view.setBookCollapsing();
        view.setOpenedBook(model.getOpenedBookFromID);
        view.catchAddBook(handleAddBook);
        
        
        
    }
    return{
        loadAllBooks,
        handleBookEvents, 
        loadDefaultBook,  
    }
})();

controller.loadAllBooks();
controller.handleBookEvents();
controller.loadDefaultBook(model.defaultTodos);
