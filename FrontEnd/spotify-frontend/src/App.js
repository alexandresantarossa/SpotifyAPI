import "./App.css";
import React from "react";
import $ from 'jquery';

class App extends React.Component{
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
        e = r.exec(q)
      while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  constructor(props){
    super(props);
    const parametros = this.getHashParams();
    const token = parametros.access_token;
    this.state = {
      token: token
    };
    this.topTracksLorde = this.topTracksLorde.bind(this);
    this.qualtoken = this.qualtoken.bind(this);
  }

  
  topTracksLorde = () =>{
    $.ajax({
    method: "GET",
    dataType: "Json",
    url:"https://api.spotify.com/v1/me/top/tracks?limit=5",
    headers: {  
    Authorization: `Bearer ${this.state.token}`
    }
  })
    .then(dados => {
      // console.log(dados.items)
      for(let i = 0; i < dados.items.length; i++){
        console.log(dados.items[i].name)
      }
      
      })
  }

  qualtoken(){
    console.log(this.state.token)
  }


  render(){
    return (
      <div className="App">
        <button> <a href="http://localhost:8888">Logar com Spotify</a> </button>
        <button onClick={this.topTracksLorde}>tracks mais escutadas</button>
        <button onClick={this.qualtoken}>token</button>
      </div>
    );
  }
}


export default App;
