import firebase from 'firebase';
import * as firebaseui from 'firebaseui'

const firebaseConfig = {
  apiKey: "AIzaSyDTHXcdrLCdHN3NR3YAfBILJR8csv_OVxo",
  authDomain: "fuzzy-enigma.firebaseapp.com",
  projectId: "fuzzy-enigma",
  storageBucket: "fuzzy-enigma.appspot.com",
  messagingSenderId: "877651879616",
  appId: "1:877651879616:web:fa3317fa63b61126a2ef25",
  measurementId: "G-6P1RBXBX1Z"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();

const ui = new firebaseui.auth.AuthUI(auth);

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      console.log('success')
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'redirect',
  signInSuccessUrl: '/',
  signInOptions: [
    {
      // Leave the lines as is for the providers you want to offer your users.
      // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    }
    
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
// ui.start('#firebaseui-auth-container', uiConfig);

const firestore = firebase.firestore();

export {
  // auth,
  firestore,
  firebase
};
