// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAhh8tXA1GH9tY0qGDTQk0-U3c7_HRthsk',
  authDomain: 'play-9d1ee.firebaseapp.com',
  projectId: 'play-9d1ee',
  storageBucket: 'play-9d1ee.appspot.com',
  messagingSenderId: '1025153083498',
  appId: '1:1025153083498:web:d5bc29577aceabbc004213',
  databaseURL: 'https://play-9d1ee-default-rtdb.firebaseio.com' // ✅ No trailing slash
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { db };
