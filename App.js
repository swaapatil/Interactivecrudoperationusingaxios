import React, { useState, useEffect } from "react";

import axios from "axios";
import { useForm } from "react-hook-form";
import "./App.css";

const App = () => {
  
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    _id: null,
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
  });

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const response = await axios.get("http://localhost:6050/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addStudent = async () => {
    try {
      const response = await axios.post(
        "http://localhost:6050/students",
        newStudent
      );
      setNewStudent({
        _id: response.data._id, // set the _id property of newStudent
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
      });
      getStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:6050/students/${newStudent._id}`,
        newStudent
      );
      setNewStudent({
        _id: null, // reset the _id property of newStudent
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
      });
      getStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:6050/students/${id}`);
      getStudents();
    } catch (error) {
      console.error(error);
    }
  };


  const { register, formState: { errors }, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);


  
  return (
    <div className="container1">
      <div className="container-left">
        <div className="table-content">
          <h1>Student data table</h1>

          <table>
            <thead>
              <tr>
                <th>First_name</th>
                <th>last_name</th>
                <th>email</th>
                <th>gender</th>
                <th>action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.email}</td>
                  <td>{student.gender}</td>
                  <td>
                    <div className="buttons">
                      <button
                        className="delete"
                        onClick={() => deleteStudent(student._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="update"
                        onClick={() => setNewStudent(student)}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {newStudent._id ? (
         <form onSubmit={handleSubmit(onSubmit)}>
           <div className="addcontent">
            <h6>Update Student</h6>
            <div >
              <div className="inputs">
                <label className="labels">First Name:</label>
                <input
                  type="text"
                  value={newStudent.first_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, first_name: e.target.value })
                  }
                />
              </div>
              <div className="inputs">
                <label className="labels">Last Name:</label>
                <input
                  type="text"
                  value={newStudent.last_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, last_name: e.target.value })
                  }
                />
              </div>
              <div className="inputs">
                <label className="labels">Email:</label>
                <input
                  type="email"
                 
                  {...register("email", {required: 'Email Address is required', pattern: /^\S+@\S+$/i})} 
                  aria-invalid={errors.email ? "true" : "false"} 
                  
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
              {errors.email && <p role="alert">{errors.email?.message}</p>}
              </div>
              <div className="inputs">
                <label className="labels">Gender:</label>
                <input
                  type="radio"
                  name="gender"
                 
                  defaultChecked={newStudent.gender === "male" ? true : ''}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, gender: e.target.value })
                  }
                />
                 <label className="labels">male</label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  defaultChecked={newStudent.gender ==="female" ? true : ''}
                  
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, gender: e.target.value })
                  }
                />
                <label className="labels">female</label>
              </div>
            </div>

            <button type="submit" onClick={handleUpdate} className="add">
              Update
            </button>
          </div>
         </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} >
          <div className="addcontent">
            <h6>Add Student</h6>
            <div >
              <div className="inputs">
                <label className="labels">First Name:</label>
                <input
                  type="text"
                  value={newStudent.first_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, first_name: e.target.value })
                  }
                />
              </div>
              <div className="inputs">
                <label className="labels">Last Name:</label>
                <input
                  type="text"
                  value={newStudent.last_name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, last_name: e.target.value })
                  }
                />
              </div>
              <div className="inputs">
                <label className="labels">Email:</label>
                <input
                  type="email"
                  title="example@gmail.com"
                  {...register("email", {required: 'Email Address is required', pattern: /^\S+@\S+$/i})} 
                  aria-invalid={errors.email ? "true" : "false"} 

                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                />
                 {errors.email && <p role="alert">{errors.email?.message}</p>}
              </div>
              <div className="inputs">
                <label className="labels">Gender:</label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  // value={newStudent.gender}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, gender: e.target.value })
                  }
                />
                 <label className="labels">male</label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  // value={newStudent.gender}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, gender: e.target.value })
                  }
                />
                <label className="labels">female</label>
              </div>
            </div>

            <button className="add" type="submit" onClick={addStudent}>
              addStudent
            </button>
          </div>
          </form>
        )}
        
      </div>
      
    </div>
  );
};

export default App;
