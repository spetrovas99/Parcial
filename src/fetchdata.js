import request from 'request';
import fs, { write } from "fs";
const getFilms = (callback,data)=>{
  data.forEach(elem=>{
      for(let i = 0; i < elem.films.length; i++){
          request({url: elem.films[i], json: true}, (error, response) => {
              elem.films[i] = {
                  title: response.body.title,
                  episode: response.body.episode_id,
              }
          });
      }
  });
  writer(callback, data);
} 
const writer = (callback, data) => {
    request({url:"https://swapi.co/api/people/?format=json", json: true}, (error, response) => {
        try{
            fs.writeFile("./data.json",JSON.stringify(data), (err) => {
                if(err) {
                    console.log("err");
                } else {
                    console.log("write");
                }
            });
        }catch(e){
            console.log("no write");
        }
    });
    callback(data);
}

const fetchData = (callback, url, data) => {
  if (!data) data = [];
  try{
    data = JSON.parse(fs.readFileSync("./data.json").toString());
    callback(data);
  }catch(e){
    console.log('fechting data...');
    request({ url, json: true }, (error, response) => {
      if (response.body) {
        data = [...data, ...response.body.results];
      }
      if (response.body.next !== null)
        fetchData(callback, response.body.next, data);
      else {
        getFilms(callback,data);
      }
    });
  }
};

export { fetchData };