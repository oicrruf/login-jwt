import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, Redirect
} from "react-router-dom";
import './App.css'
import { Formik } from "formik";
import axios from 'axios';
import jwt from 'jwt-decode';

const logout = () => {
  axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/logout`, { body: null }, {
    headers: {
      'Content-Type': 'application/json',
      'auth-token': localStorage.getItem('token')
    }
  })
    .then(function (response) {
      console.log(response.data.msg)
      if (response.status === 200) {
        localStorage.removeItem('token');
        window.location = '/';
      }
    })
    .catch(function (error) {
      console.log(error.data.msg)
    });
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>

          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


function Home() {
  const login = (data) => {
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/user/login`, data)
      .then(function (response) {
        // console.log(response)
        // document.querySelector('#data').innerText = JSON.stringify(response.data.data)
        localStorage.setItem('token', response.data.data.token);
        window.location.href = 'https://tic-tac-toe-backend-g34/dashboard'
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <Formik
      initialValues={{
        email: "",
        password: "",

      }}
      validate={(valores) => {
        let errores = {};

        if (!valores.password) {
          errores.password = "Por favor capture su contraseña";
          // console.log('password');
        } else if (!/^.{4,12}$/.test(valores.password)) {
          errores.password =
            "La contraseña puede contener de 4 a 12 caracteres";
        }

        if (!valores.email) {
          errores.email = "Por favor ingrese su correo";
          // console.log('email');
        } else if (
          !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
            valores.email
          )
        ) {
          errores.email =
            "El correo solo puede contener, letras, numeros, puntos, guiones y guion bajo";
        }
        return errores;
      }}
      onSubmit={(valores, { resetForm }) => {
        // resetForm();
        login(valores)
      }}
    >
      {({
        errors,
        touched,
        values,
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        <div>
          <form
            className="px-3"
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label className="d-block">Correo electronico</label>
              <input
                className="d-block"
                placeholder="Ingrese su correo electronico"
                id="email"
                type="texto"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}></input>
            </div>
            <div className="mb-3">
              <label className="d-block">Contrasena</label>
              <input
                className="d-block"
                placeholder="Ingrese su contrasena"
                id="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              ></input>
            </div>
            <div className="mb-3">
              <button>Iniciar sesion</button>
            </div>
          </form>
          {/* <p id="data"></p> */}
        </div>
      )}
    </Formik>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}


// Aqui empiza el componente Dashboard
const Dashboard = () => {
  const [redirect, setRedirect] = useState(false);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log(localStorage.getItem('token'))
    axios.post(`${process.env.REACT_APP_API_SERVER}/api/dashboard`,
      { "body": null },
      {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      })
      .then(function (response) {
        setTitle(response.data.data.title);
        setUser(response.data.data.user);
      })
      .catch(function (error) {
        console.log(error);
        setRedirect(true)
      });
  }, [])



  return (
    <div>
      {redirect && <Redirect to="/" />}
      <h1>Dashboard - {title}</h1>
      <button onClick={() => {
        logout();
        setRedirect(true)
      }}>Logout</button>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>)
}

export default App;
