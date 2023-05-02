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
    url:"https://api.spotify.com/v1/artists/4q3ewBCX7sLwd24euuV69X/top-tracks?market=BR",
    headers: {
    Authorization: `Bearer ${this.state.token}`
    }
  })
    .then(dados => {
      console.log(this.state.token)
      console.log(dados)
      
      })
  }

  qualtoken(){
    console.log(this.state.token)
  }


  render(){
    return (
      <div className="App">
        <button> <a href="http://localhost:8888">Logar com Spotify</a> </button>
        <button onClick={this.topTracksLorde}>Buscar top tracks da Lorde</button>
        <button onClick={this.qualtoken}>token</button>
      </div>
    );
  }
}


export default App;
