const express = require('express'); //adding express

const mongo = require("mongodb").MongoClient; // adding mongodb

const dbUrl = "mongodb://localhost:27017/lb23_store"; // connection to mongodb

const path = require("path"); // adding path

const {response} = require("express");

const app = express();

app.set('views', path.join(__dirname, 'views')); // setting path to views

app.set('view engine', 'pug'); // setting up view engine

app.use(express.static(path.join(__dirname, 'public'))); // setting path for utility files like css and js

app.use(express.urlencoded({ extended: true})); // enabling url encoding

app.use(express.json());

mongo.connect() // initiating a connection to mongdb

let db;
let ObjectId = require("mongodb").ObjectId;
let navLinks;
let members;
// fetch data from the database
mongo.connect(dbUrl,(error, client) =>{
    //selecting db
    db = client.db("lb23_store");
    //fetch nav links from the database
    db.collection("navLinks").find({}).toArray((error , response) => {
       navLinks = response;
    });
    //fetch team members from the database
    db.collection("team_members").find({}).toArray((err , res) => {
       members = res;
    });
});

// code to load Home page
app.get('/' , (request , response) => {
    response.render('index', {title : 'Home' , links : navLinks , team_members: members});
});

// code to load add new team member form
app.get('/add-team-member' , (request , response) => {
    response.render('member-add', {title : 'Add Team Member' , links : navLinks, numLinks:navLinks.length});
});

//code to add a new team member
app.post('/team-member/add' , (request , response) => {
    //get posted form data
    let role = request.body.role;
    let joined = request.body.joined;
    let name = request.body.name;
    let newMember = {"joined": joined , "role" : role , "name" : name};
    db.collection("team_members").insertOne(newMember , (error , result) =>{
        if(error) throw error;
        refreshTeamMembers();
        response.redirect('/');
    });

});
//code to delete a team member
app.get('/member/delete', (request, response) =>{
    //get member details
    let id = new ObjectId(request.query.memberId);
    db.collection('team_members').deleteOne({_id : id},(error , result) => {
        if(error) throw error;
        refreshTeamMembers();
        response.redirect('/');
    });

});

//code to show edit a team member form
app.get('/member/edit',(request , response) =>{
    let id = new ObjectId(request.query.memberId);
    db.collection('team_members').findOne({_id:id} ,(error , result) =>{
        if(error) throw error;
        response.render('member-edit',{ title: 'Edit Team member' , links : navLinks , editMember : result});
    });
});


//code to update a team member's details
app.post('/team-member/update' ,(request , response)=> {
    let id = new ObjectId(request.body.id);
    let name = request.body.name;
    let joined = request.body.joined;
    let role = request.body.role;
    db.collection('team_members').updateOne(
        {_id:id},
        {
            $set: {
                name: name,
                role: role,
                joined: joined
            }
        },
        {new: true},
        (error , result) =>{
            if(error) throw error;
            refreshTeamMembers();
            response.redirect('/');
        }
    );
});


//function to refresh team members after adding , creating or deleting
function refreshTeamMembers(){
    db.collection('team_members').find({}).toArray((error , result) => {
       members = result;
    });
}

//testing the post that we are running on
const server = app.listen(7000 , () =>{
    console.log(`we are on port ${server.address().port}`);
});
