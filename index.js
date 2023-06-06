const express = require("express"); 
const app = express(); 
const port = 3100;
const { initDB } = require("./db");
const ToDo = require ("./db/models/ToDo_model");
const { cast } = require("sequelize");

initDB();

app.use(express.json());

app.listen(port, ()=> {
    console.log("Application listening on port" + port);
})

app.get("/sum", (req, res) => {  
    const a = req.body.a
    const b = req.body.b
    const sum = a + b
    res.json(sum)
})


app.post("/reverse-case", (req, res) => {

    const str = req.body.text;
    let new_text = "";

    //function reverseCase(str) {

        for (let i = 0; i < str.length; i++) {
          if (str[i] === str[i].toUpperCase()) {
            new_text += str[i].toLowerCase();
          } else {
            new_text += str[i].toUpperCase();
          }
        }
        //return new_text
     //}
    //res.json(reverseCase("MyTestString"));
    res.json({ new_text})
})
    
  
 app.put("/obj-to-array", (req, res) => { 
  const x = req.body.x; 
   const massKeys = Object.keys(x); 
   const massValues = Object.values(x); 
   console.log(massKeys, massValues); 
   let mass = []; 
   for (let i = 0; i < massKeys.length; i++) { 
     mass.push({ 
       key: massKeys[i], 
       Value: massValues[i], 
    }); 
   } 
   res.json( mass ); 
 })


app.patch("/reverse-array", (req, res) => {
  const array = req.body.array;
  res.json(array.reverse())
})


app.delete("/duplicates", (req, res) => {
  let array = req.body.array
  res.json(Array.from(new Set(array)))
  })
  


app.get("/api/todos", async (req,res) => {
  try {
    const todoList = await ToDo.findAll();
    res.json(todoList)
  } catch (error) {
    res.status(500).json("ERROR")
  }
})


app.get("/api/todos/:id", async (req, res) => {
  try {
    let todo = await ToDo.findByPk(req.params.id);
    if (todo) {
      res.json(todo);
    }
    else {
      res.status(404).json("ID not found");
    }
  } catch (error) {
    res.status(500).json("ERROR");
  }
})


app.post("/api/todos", async (req, res) => {
  try {
    let todo = await ToDo.create({
      title: req.body.title,
      description: req.body.description,
      isDone: req.body.isDone

    });
    res.json(todo);
  } catch (error) { 
    res.status(500).json("ERROR");
  }
})


app.patch("/api/todos/:id", async (req, res) => {
  try {
    let todo = await ToDo.findByPk(req.params.id);
    if (todo) {
      await todo.update({
        title: req.body.title,
        description: req.body.description
      })
      res.json("Changed");
    }
    else{
      res.status(404).json("ID not found")
    }
  } catch (error) {
    res.status(500).json("ERROR");
  }
})


app.delete("/api/todos/:id", async (req, res) => {
  try {
    let todo = await ToDo.findByPk(req.params.id); 
    if (todo) {
      await todo.destroy();
      res.json(req.params.id + " Deleted")
    }
    else{
      res.status(500).json("ID not found")
    }
  } catch (error) {
    res.status(500).json("ERROR")
  }
})



app.delete("/api/todos", async (req, res) => { 
  try { 
    await ToDo.destroy({ where: {}}); 
    res.status(200).json("DB deleted") 
  } catch (error) { 
    res.status(500).json("ERROR") 
  }
})