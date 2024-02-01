import React, { useState, useEffect, useContext } from 'react'
import axios from "axios";
// import { AppContext } from '../../context/context';
import Cookies from 'js-cookie';

export const SERVER_URL = "http://localhost:3001/" //change to render


export const apiRequest = async (_url, _method, _body = {}) => {
  try {
    console.log(_url);
    let resp = await axios({
      url: _url,
      method: _method,
      data: _body,
      headers: {
        "x-api-key": Cookies.get('token')
        
      }
    })

    return resp;
  }
  catch (err) {
    throw err;
  }
}
export const apiRequestWithoutToken = async (_url, _method, _body = {}) => {
  try {
    let resp = await axios({
      url: _url,
      method: _method,
      data: _body,
    })

    return resp;
  }
  catch (err) {
    throw err;
  }
}

export const apiRequestNoBody = async (_url, _method) => {
  try {
    let resp = await axios({
      url: _url,
      method: _method,
      headers: {
        "x-api-key": Cookies.get('token')
      }
    })
    return resp;
  }
  catch (err) {
    throw err;
  }
}

export const apiRequestGet = async (_url) => {
  try {
    let resp = await axios({
      url: _url,
      method: "GET",
      headers: {
        "x-api-key": Cookies.get('token')
      }
    })
    return resp;
  }
  catch (err) {
    throw err;
  }
}
export const tokenExpireAlert = (err) => {

  if (err.response.data.msg === "Token invalid or expired, log in again or you hacker!") {
    {
      const confirmation = confirm("Your session expired. Please login again.");
      // setUser(null)
      Cookies.remove('user');
      if (confirmation) {
        window.location.href = "/login"; // Redirect to login page
      } else {
        window.location.href = "/"; // Redirect to index page
      }
    }

  }
};
