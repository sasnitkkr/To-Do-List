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
                res.render('list', {listTitle : "Today", newItems: docs});
            }
        }
    });

});

app.post("/", (req, res)=>{

    const newItemName = req.body.newItemName; // from Input
    const listTitle = req.body.listTitle; //from submit button

    const newItem = new homeItem({
        name : newItemName
    });
    console.log("Post Request Made");
    console.log(newItem);

    if(listTitle === "Today")
    {   
        newItem.save(); 
        res.redirect("/");
    }
    else
    {
        // Insert newItem in Our Custom List
        List.findOne({name: listTitle}, (err, foundList)=>{
            if(err){
                console.log(err);
            }else{
                // Insert item in the foundList
                console.log(foundList);
                foundList.items.push(newItem);
                foundList.save();//save doc in collection
                res.redirect("/"+listTitle);
            }
        })    
    }
});

app.post("/delete", (req, res)=>{
    // console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    const listTitle = req.body.listTitle;

    if(listTitle === "Today")
    {
        homeItem.deleteOne({_id : checkedItemId}, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("deleted one item successfully");
            }   
        });
        res.redirect("/");
    }
    else
    {
        // https://stackoverflow.com/questions/14763721/mongoose-delete-array-element-in-document-and-save/27917378
        // Codition : which list, What Update, Callback
        List.findOneAndUpdate({name : listTitle},{$pull:{items:{_id: checkedItemId}}},(err, foundList)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect("/"+listTitle);
            }
        });
        
    }
    
    // res.redirect("/"+customListName);
});


app.get("/:customListName", (req, res)=>{
    
    console.log("---------Inside Dynamic Route----------------");

    const customListName = req.params.customListName;

    List.findOne({name : customListName}, (err, foundList)=>{
        if(err){
            console.log("-----Error-----")
            console.log(err);
        }else{
            if(!foundList){
                // If List is Not Found Create List
                console.log("--------List Not Found----------");
                console.log("--------Creating List-----------");
                const list = new List({
                    name : customListName,
                    items : defArr
                });
                
                list.save();
                res.redirect("/"+customListName);      
            }else{
                console.log("---------List Already Present----------");
                console.log("----------Displaying List-----------");
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