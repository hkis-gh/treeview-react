import axios from 'axios'

/*
  common get method for external api calls
*/
export const get = (url) => {
  return axios({ method: 'GET', url: url, headers: { 'Access-Control-Allow-Origin': '*' } })
    .then((response) => response.data);
}

/*
  as of now only get method added, base on requirement will add post, put and delete methods 
*/