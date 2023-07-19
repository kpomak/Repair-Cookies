import React, {Component} from 'react';
import axios from 'axios';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import NotFound404 from './components/notfound';
import RegisterForm from './components/registerForm';
import LoginForm from './components/loginForm';
import Repair from './components/repair';
import Home from './components/home';
import Status from './components/status';
import Account from "./components/account";
import Contacts from "./components/contacts";
import Phones from "./components/phones";
import Prices from "./components/priceList";
import Cookies from 'universal-cookie';
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Notebooks from "./components/notebooks";
import Tablets from "./components/tablets";

class App extends Component {
  constructor(props) {
    super(props)
    this.apiPath = 'http://localhost:8001/';
    this.state = {
      'token': '',
      'email': '',
      'users': [],
      'orders': [],
      'endpoints': ['users', 'orders']
    }
  }

  notify(message) {
    toast(`${message}`);
  }


  createClient(url, data) {
    const headers = this.getHeaders();
    axios.post(this.apiPath + url, data, {'headers': headers}).then(response => {
      this.notify('Вы успешно зарегистрированы!');
      this.getToken(data.email, data.password)
    }).catch(error => {
          console.log('Что вообще могло пойти так?', error);
          for (const key in error.response.data) {
            this.notify(`${key}: ${error.response.data[key]}`)
          }
        }
    );
  }

  getToken(email, password) {
    const data = {
      'username': email,
      'password': password
    };
    axios.post(
        this.apiPath + 'api-token-auth/',
        data
    ).then(response => {
      this.saveToken(response.data['token'], email)
    })
        .catch(error => this.notify('Wrong value of email or password'));
  }


  saveToken(token, email = '') {
    const cookie = new Cookies();
    cookie.set('token', token);
    cookie.set('email', email);
    cookie.set('SameSite', 'Lax');
    this.setState({'token': token, 'email': email}, () => this.pullData());
  }

  restoreToken() {
    const cookie = new Cookies();
    const token = cookie.get('token');
    const email = cookie.get('email');
    this.setState({'token': token, 'email': email}, () => this.pullData());
  }

  isAuth() {
    return !!this.state.token;
  }

  getHeaders() {
    let headers = {
      "Content-Type": "application/json"
    };
    if (this.isAuth()) {
      headers['Authorization'] = 'Token ' + this.state.token
    }
    return headers;
  }


  pullData() {
    if (!this.isAuth()) return;
    const headers = this.getHeaders();
    const download = endpoint => {
      axios.get(
          this.apiPath + `api/${endpoint}?email=${this.state.email}`,
          {'headers': headers}
      ).then(response => {
        this.setState({[endpoint]: response.data})
      }).catch(
          error => console.log(`Что могло пойти так при обращении к ${endpoint}?`));
    }
    this.state.endpoints.forEach(endpoint => {
      download(endpoint);
    });
  }


  makeOrder(category, customerDescription) {
    const headers = this.getHeaders();
    const user = this.state.users[0]
    const data = {
      "client": {
        "id": user.id,
        "phoneNumber": user.phoneNumber
      },
      "category": category,
      "customerDescription": customerDescription
    }
    axios.post(
        this.apiPath + `api/orders/`,
        data,
        {'headers': headers}
    ).then(response => {
      this.notify("Ваша заявка на ремонт отправлена 🙌");
      this.pullData()
      setTimeout(() => {
        // this.props.navigate('../account')
        window.location.href = '../account'
      }, 6000)
    })
        .catch(error => this.notify('С вашего лицевого счета будет списано 5700 рублей, не забудьте пополнить баланс.'));
  }

  checkStatus(orderNumber) {
    axios.get(`${this.apiPath}/status?order=${orderNumber}`)
        .then(response => {
          this.notify("Можно забирать.")
        })
        .catch(error => this.notify('Еще не готово.'));
  }

  componentDidMount() {
    this.restoreToken();
  }

  render() {
    return (
        <div className="container">
          <BrowserRouter>
            <Header
                isAuth={() => this.isAuth()}
                saveToken={() => {
                  this.saveToken('')
                }}
                logOut={() => {
                  this.saveToken('')
                }}/>
            <ToastContainer/>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='repair' element={<Repair
                  isAuth={() => this.isAuth()}
                  makeOrder={(category, customerDescription) => this.makeOrder(category, customerDescription)}/>}/>
              <Route path='status' element={<Status
                  checkStatus={(orderNumber) => this.checkStatus(orderNumber)}/>}/>
              <Route path='contacts' element={<Contacts/>}/>
              <Route path='services' element={<Navigate to="/services/phones"/>}/>
              <Route path='/services/phones' element={<Phones/>}/>
              <Route path='/services/notebooks' element={<Notebooks/>}/>
              <Route path='/services/tablets' element={<Tablets/>}/>
              <Route path='prices' element={<Prices/>}/>
              <Route path='auth' element={<LoginForm
                  isAuth={() => this.isAuth()}
                  getToken={(email, password) => this.getToken(email, password)}/>}/>
              <Route path='account' element={<Account
                  orders={this.state.orders}
                  isAuth={() => this.isAuth()}
                  logOut={() => {
                    this.saveToken('')
                  }}/>}/>
              <Route path='register' element={<RegisterForm
                  isAuth={() => this.isAuth()}
                  createClient={(url, data) => this.createClient(url, data)}
                  getToken={(email, password) => this.getToken(email, password)}/>}/>
              <Route path='*' element={<NotFound404/>}/>
            </Routes>
            <Footer/>
          </BrowserRouter>
        </div>
    );
  }
}

export default App
