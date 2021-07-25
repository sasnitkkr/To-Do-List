const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
console.log(date);
const PORT = 3000;
const app = express();
// let homeList = [];
// let workList = [];
const mongoose = require("mongoose");
const { addListener } = require('nodemon');
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});


app.set('view engine', 'ejs');
// Body Parser - Express v4.16.0 and higher
app.use(express.urlencoded({
  extended: true
}));
// For static files css, images, etc
app.use(express.static("public"));

const itemsSchema = new mongoose.Schema({
    name : String
})

const homeItem = mongoose.model('homeItem', itemsSchema);

/* Create 3 default documents */
const default1 = new homeItem({name : "Welcome to your to-do list"});
const default2 = new homeItem({name : "Hit the + button to add new item"});
const default3 = new homeItem({name : "<-- hit this to delete the item"});
const defArr = [default1, default2, default3];

const ListSchema = new mongoose.Schema({
    name : String,
    items : [itemsSchema]
});

const List = mongoose.model('List', ListSchema);

app.get("/", (req, res) => {
    // get today's date string
    
    let today = date.getDate();
    

    homeItem.find({}, function(err, docs){
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(docs.length === 0)
            {
                /* Add default docs to homeItems collection : C for CREATE/INSERT */
                homeItem.insertMany(defArr,function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("inserted defaults successfully");
                    }
                });
                res.redirect("/");
            }
            else{
                res.render('list', {listTitle : today, newItems: docs});
            }
        }
    });

});

// app.get("/work", (req, res) =>{
//     res.render('list', {listTitle:"Work", newItems: workList})
// })

app.post("/", (req, res)=>{

    let listPlace = req.body.submitButton;
    let itemName = req.body.newItem;
    console.log(listPlace);
    if(listPlace === "Work")
    {
        workList.push(item);
        res.redirect("/work");
    }
    else
    {   
        const newItem = new homeItem({
            name : itemName
        });
        newItem.save(); 
        res.redirect("/");
    }
});

app.post("/delete", (req, res)=>{
    // console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    homeItem.deleteOne({_id : checkedItemId}, (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("deleted one item successfully");
        }   
    });
    res.redirect("/");
});


app.get("/:customListName", (req, res)=>{
    // res.send(req.params.customListName);
    const customListName = req.params.customListName;

    List.findOne({name : customListName}, (err, foundList)=>{
        if(err){
            console.log(err);
        }else{
            if(!foundList){
                // If List is Not Found Create List
                const list = new List({
                    name : customListName,
                    items : defArr
                });
                
                list.save();
                res.redirect("/"+customListName);      
            }else{
                // Display List is Already Present
                res.render("list",{listTitle: foundList.name, newItems : foundList.items});
            }
        }
    });
});

// app.post("/:customListName/post")

app.listen(PORT,()=>{
    console.log("Server started at port "+PORT);
})