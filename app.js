const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
console.log(date);
const PORT = 3000;
const app = express();
let homeList = [];
let workList = [];

app.set('view engine', 'ejs');
// Body Parser - Express v4.16.0 and higher
app.use(express.urlencoded({
  extended: true
}));
// For static files css, images, etc
app.use(express.static("public"));

app.get("/", (req, res) => {
    // get today's date string
    
    let today = date.getDate();

    res.render('list', {listTitle : today, newItems: homeList});
})

app.get("/work", (req, res) =>{
    res.render('list', {listTitle:"Work", newItems: workList})
})

app.post("/", (req, res)=>{

    let listPlace = req.body.submitButton;
    let item = req.body.newItem;
    console.log(listPlace);
    if(listPlace === "Work")
    {
        workList.push(item);
        res.redirect("/work");
    }
    else
    {   
        homeList.push(item); 
        res.redirect("/");
    }
})

app.listen(PORT,()=>{
    console.log("Server started at port "+PORT);
})