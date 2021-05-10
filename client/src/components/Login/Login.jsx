import { Component } from 'react'
import { auth } from '../../firebase/firebase';

export default class Login extends Component {

  constructor() {
    super();
    this.state = {};
  }

  // signUp(email, password) {
  //   auth().createUserWithEmailAndPassword(email, password)
  //     .then((userCredential) => {
  //       // Signed in 
  //       var user = userCredential.user;
  //       // ...
  //     })
  //     .catch((error) => {
  //       var errorCode = error.code;
  //       var errorMessage = error.message;
  //       // ..
  //     });
  // }

  render() {
    return (
      <div>
        <h1>Welcome to My Awesome App</h1>
        <div id="firebaseui-auth-container"></div>
        <div id="loader">Loading...</div>
      </div>
    )
  }
}
