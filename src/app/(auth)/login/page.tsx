"use client";

import { AuthCredentialsValidator, TAuthCredentialsValudator } from '@/lib/validators/account-credentials-validator';
import { getAuth, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from '@/app/config/firebasecfg';
import { Toaster, toast } from 'sonner'
import { useEffect } from 'react';

const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

const Login = () => {
  const auth = getAuth(); 

  useEffect(() => {
    const message = sessionStorage.getItem('toastMessage');
    let isToast = false;
  
    if (message) {
      toast.success(message)
      sessionStorage.removeItem('toastMessage');
      isToast = true;
    }
  }, []);

  return (
    <>
      <Toaster position="bottom-center" richColors  />
      <h1>Login</h1>
    </>
  )
}

export default Login;
