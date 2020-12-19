import React from 'react'
import { lazy } from "react"


// this function function for lazy route load...........
const ReactLazyPreload  = (importStatement)=>{
  const Component = lazy(importStatement)

  // Component.preload call when preload link clicked 
  Component.preload = importStatement
  return Component
} 


const HomePage = ReactLazyPreload( ()=>import("./pages/HomePage") )
// const ProductPage = ReactLazyPreload( ()=>import("./pages/ProductPage/ProductPage") )
// const ProductDetails = ReactLazyPreload( ()=>import("./pages/ProductPage/ProductDetails/ProductDetails") )
// const AddProduct = ReactLazyPreload( ()=>import("./pages/ProductPage/AddProduct/AddProduct") )

// const SignupPage = ReactLazyPreload( ()=>import("./pages/SignupPage/SignupPage") )
const LoginPage = ReactLazyPreload( ()=>import("./pages/LoginPage/LoginPage") )
// const ProfilePage = ReactLazyPreload( ()=>import("./pages/ProfilePage/ProfilePage") )

import Messenger from "pages/Messenger/Messenger";

const routes = [
  { path: "/", exact: true, component: HomePage },
  { path: "/messenger", exact: true, component: Messenger },
  // { path: "/products",  exact: true, component: ProductPage },
  // { path: "/product/:productId",  exact: true, component: ProductDetails },
]

let isAuth = null;


function g(isAuthenticated, where){
  if(where === "app"){
    isAuth = isAuthenticated
  }
  
  if(isAuth){
    return [
      ...routes,
      // { path: "/add-product", exact: true, component: AddProduct },
      // { path: "/update-product/:productId", exact: true, component: AddProduct },
      // { path: "/auth/profile", exact: true, component: ProfilePage },
      // { path: "/products/:authorId", exact: true, component: ProductPage },
    ]
  } else {
    return [
      ...routes,
      { path: "/auth/login", component: LoginPage },
      // { path: "/auth/signup", component: SignupPage }
    ]
  }
}

export default g