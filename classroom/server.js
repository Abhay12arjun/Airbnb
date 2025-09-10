import express from 'express';
const PORT=3000;
const app=express();

//Index Users
app.get("/users",(req,res)=>{
    res.send("GET for users")
})
//show users
app.get("/users/:id",(req,res)=>{
    res.send("Get for user id")
})
//Post - users
app.post("/users",(req,res)=>{
    res.send("Post for users")
})
//Delete-users
app.delete("/users/:id",(req,res)=>{
    res.send("deleted......")
})

//Posts ...........
app.get("/posts",(req,res)=>{
    res.send("Get for post");
})
//show 
app.get("/posts/:id",(req,res)=>{
    res.send("Get for post id")
})
//POST
app.post("/posts",(req,res)=>{
    res.send("Post for posts");
})
//DELETE
app.delete("/posts/:id",(req,res)=>{
    res.send("Delete for post id")
})
app.listen(PORT,(req,res)=>{
    console.log("Server running...........")
})