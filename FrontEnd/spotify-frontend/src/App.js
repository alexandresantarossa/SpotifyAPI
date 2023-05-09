import "./App.css";
import React from "react";
import $ from 'jquery';

class App extends React.Component {
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

  constructor(props) {
    super(props);
    const parametros = this.getHashParams();
    const token = parametros.access_token;
    const nome = parametros.name;
    
    this.state = {
      token: token,
      topTracks: [], // state para armazenar as principais músicas
      nome: nome // nome do usuário
    };
    this.topTracksLorde = this.topTracksLorde.bind(this);
    this.qualtoken = this.qualtoken.bind(this);
  }

  topTracksLorde = () => {
    if (!this.state.token) {
      console.log("Token não fornecido.");
      return;
    }

    $.ajax({
      method: "GET",
      dataType: "Json",
      url:"https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10",
      headers: {  
        Authorization: `Bearer ${this.state.token}`
      },
      success: dados => {
        this.setState({ topTracks: dados.items }); // atualiza o state com as principais músicas

      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      }
    });
  }

  apitecwebPOST = () =>{
    if (!this.state.topTracks.length) {
      console.log("Lista de músicas não encontrada.");
      return;
    }
  
    const maisEscutada = this.state.topTracks[0]; // seleciona a música mais ouvida
    const data = {
      title: maisEscutada.name,
      artist: maisEscutada.artists[0].name
    }; // cria um objeto com as informações da música mais ouvida
  
    $.ajax({
      method: "POST",
      dataType: "Json",
      url:"http://localhost:8000/api/musics/",
      headers: {},
      data: data,
      success: () => {
        console.log("Música enviada com sucesso.");
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
        console.log("DEU PAU BRO");
      }
    })
  }
  
  apitecwebGET = () =>{
    
    $.ajax({
      method: "GET",
      dataType: "Json",
      url:"http://localhost:8000/api/musics/",
      headers: {},
      success: dados => {
        console.log(dados);
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      }
    })

  }

  qualtoken() {
    console.log(this.state.token);
  }

  render(){
    return (
      <div className="App">
        <div className="header">
          <h1>TecWeb Songs</h1>
          <p>Feito na disciplina de Tecnologias Web, nosso site te mostra
            as suas músicas mais ouvidas no Spotify. Para isso, basta logar com sua conta
            e clicar no botão "Veja suas principais músicas".
          </p>
        </div>
        {this.state.nome && (
          <h2>Olá, {this.state.nome}!</h2>
        )}
        <button className="btn btn-primary" onClick={() => window.location.href = "http://localhost:8888"}>Logar com Spotify</button>
        <button className="btn btn-primary" onClick={this.topTracksLorde}>Veja suas principais músicas</button>
        <button className="btn btn-primary" onClick={this.apitecwebPOST}>Adicionar a base de dados</button>
        {this.state.topTracks.length > 0 && (
          <div className="tracks">
            <h2>Suas principais músicas são:</h2>
            <ul>
              {this.state.topTracks.map((track, index) => (
                <li key={index}>{track.name} - {track.artists[0].name}</li>
              ))}
            </ul>
          </div>
        )}
      <div className="credits">
      <p>Powered by KNBS 💀</p>
      </div>      
    </div>
    );
  }
  
}

export default App;
