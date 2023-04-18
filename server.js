// import express from  'express'
// import bodyParser from 'body-parser';
// import { ObjectId } from 'mongodb';
// import cors from 'cors'
// const app=express()
// const port=8050


// app.use(cors())
// app.use(express.json())
// app.use(bodyParser.json({limit: '10mb'}));
// app.use(bodyParser.urlencoded({ extended: true }));

// // ***********************************db connection*********************************
// import mongodb from 'mongodb'
// import data from './data.js'
// let db=await mongodb.MongoClient.connect("mongodb://localhost:27017/mydb4")

// db=db.db('mydb4')
// // db.createCollection("students");
// let Student = db.collection("students");


// const data1=data
// // Student.insertMany(data1)

// // console.log(db)


// // ***********************************************************************


// app.get('/',(req,res)=>{
//     res.json({message:"api is working"})
// })

// // getting data from database
// app.get('/getdata',async (req,res)=>{
//     try {
//         const student = await Student.find().toArray();
//         res.json(student)
//       } 
//     catch{
//         console.error('Failed to get data ', err);
//         res.status(500).send('Failed to get data ');
//     }
// })

// // single data
// app.get('/getdata/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const student = await Student.findOne({ _id: new ObjectId(id) });
//     if (student) {
//       res.json(student);
//     } else {
//       res.status(404).send(`Student with id ${id} not found`);
//     }
//   } catch (err) {
//     console.error(`Failed to get student with id ${id}`, err);
//     res.status(500).send(`Failed to get student with id ${id}`);
//   }
// });


// // posting data to database
// app.post('/postdata', async (req, res) => {
//     try {
//       if (!req.body.email) {
//         res.status(400).json({ error: 'Email is required' });
//       }

//       const student = await Student.insertOne({
      
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//         email: req.body.email,
//         gender: req.body.gender
//       });

   
//       res.json(student);

//     } catch (err) {
//       console.error('Error handling POST request:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


// // updating data from database 
// app.put('/update/:_id', async (req, res) => {
//   try {
//     console.log(req.params)
//     const _id = req.params._id;
//     console.log("ID : $$$$$$$$$$$$$ Working : ", _id);
//     if (!ObjectId.isValid(_id)) {
//       res.status(400).send('Invalid ID');
//       return;
//     }
//     const objectId = new ObjectId(_id);
//     console.log("Object................",objectId);
//     const updateObject = { ...req.body };
//       delete updateObject._id;
//     const result = await Student.updateOne({ _id: objectId }, { $set: updateObject });
//     console.log("Result: ", result);
//     res.json(result);

//   } catch (err) {
//     console.error('Failed to update ', err.message, err.stack);
//     res.status(500).send('Failed to update the data');
//   }
// });





// // deleting data from database
// app.delete('/deletedata/:_id', async (req, res) => {
//   try {
//     // const id = req.params._id;
//     // const user = await collection.deleteOne({ _id: id });
//     // res.json(user);

//     console.log(req.params)
//     const _id = req.params._id;
//     console.log("ID : $$$$$$$$$$$$$ Working : ", _id);
//     if (!ObjectId.isValid(_id)) {
//       res.status(400).send('Invalid ID');
//       return;
//     }
//     const objectId = new ObjectId(_id);
//     console.log("Object................",objectId);
   
     
//     const result = await Student.deleteOne({ _id: objectId });
//     console.log("Result: ", result);
//     res.json(result);
//   } catch (err) {
//     console.error('Error :', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(port,()=>{
//     console.log(`server is runnig on port ${port}`)
// })


import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 6050;

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
let db;

(async () => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    db = client.db('mydb4');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
})();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await db.collection('students').find().toArray();
    res.json(students);
  } catch (err) {
    console.error('Failed to get students', err);
    res.status(500).send('Failed to get students');
  }
});

// Get a student by id
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await db.collection('students').findOne({ _id: new ObjectId(id) });
    if (student) {
      res.json(student);
    } else {
      res.status(404).send(`Student with id ${id} not found`);
    }
  } catch (err) {
    console.error(`Failed to get student with id ${id}`, err);
    res.status(500).send(`Failed to get student with id ${id}`);
  }
});

// Add a new student
app.post('/students', async (req, res) => {
  try {
    const { first_name, last_name, email, gender } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }
    const student = await db.collection('students').insertOne({
      first_name,
      last_name,
      email,
      gender,
    });
    res.json(student);
  } catch (err) {
    console.error('Failed to add student', err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Update a student by id
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { first_name, last_name, email, gender } = req.body;
    const objectId = new ObjectId(id);
    const result = await db.collection('students').updateOne(
      { _id: objectId },
      {
        $set: {
          first_name,
          last_name,
          email,
          gender,
        },
      },
    );
    res.json(result);
  } catch (err) {
    console.error(`Failed to update student with id ${id}`, err);
    res.status(500).send(`Failed to update student with id ${id}`);
  }
});

// Delete a student by id
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const objectId = new ObjectId(id);
    const result = await db.collection('students').deleteOne({ _id: objectId });
    res.json(result);
  } catch (err) {
    console.error(`Failed to delete student with id ${id}`, err);
    res.status(500).send(`Failed to delete student with id ${id}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});