import React, { useState } from "react";
import $ from "jquery";
import "./App.css";

class App extends React.Component {
  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
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
      nome: nome, // nome do usuário
      albumCovers: [], // state para armazenar as capas dos álbuns
      timeRange: "long_term", // Valor padrão: long_term (all-time)
      topArtists: [], // state para armazenar os artistas mais ouvidos
      artistCovers: [], // state para armazenar as capas dos artistas
      exibirModal: false, // state para controlar a exibição do modal
    };

    this.topTracksLorde = this.topTracksLorde.bind(this);
    this.apitecwebPOST = this.apitecwebPOST.bind(this);
    this.topArtists = this.topArtists.bind(this);
    this.login = this.login.bind(this);
    this.playlist = this.playlist.bind(this);
    this.getHashParams = this.getHashParams.bind(this)
  }

  handleTimeRangeChange = (event) => {
    this.setState({ timeRange: event.target.value });
  };
  topArtists = () => {
    const { timeRange } = this.state;
    const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=10`;
    if (!this.state.token) {
      console.log("Token não fornecido.");
      return;
    }
    $.ajax({
      method: "GET",
      dataType: "json",
      url: url,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
      success: (dados) => {
        this.setState({ topArtists: dados.items }); // atualiza o state com os artistas mais ouvidos
        console.log(dados.items);
        const artistIds = dados.items.map((artist) => artist.id);
        this.getArtistCovers(artistIds); // Call getArtistCovers instead of topArtists
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      },
    });
  };

  getArtistCovers = (artistIds) => {
    if (!this.state.token) {
      console.log("Token não fornecido.");
      return;
    }
    $.ajax({
      method: "GET",
      dataType: "json",
      url: `https://api.spotify.com/v1/artists?ids=${artistIds.join(",")}`,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
      success: (dados) => {
        const artistCovers = dados.artists.map((artist) => artist.images[0].url);
        this.setState({ artistCovers: artistCovers });
        console.log(artistCovers);
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      },
    });
  };


  topTracksLorde = () => {
    const { timeRange } = this.state;
    const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10`;

    if (!this.state.token) {
      console.log("Token não fornecido.");
      return;
    }

    $.ajax({
      method: "GET",
      dataType: "json",
      url: url,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
      success: (dados) => {
        this.setState({ topTracks: dados.items }); // atualiza o state com as principais músicas

        // Obtém as capas dos álbuns
        const albumIds = dados.items.map((track) => track.album.id);
        this.getAlbumCovers(albumIds);
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      },
    });
  };

  playlist = () => {
    if (!this.state.token) {
      console.log("Token não fornecido.");
      return;
      
    }
    $.ajax({
      method: "GET",
      dataType: "json",
      url: `https://api.spotify.com/v1/me/playlists`,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
      success: (dados) => {
        console.log(dados);
        const total = dados.total;
        this.setState({ total });
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      },
    });
  }

  login = () => {
    if (!this.state.token) {
      console.log("Token não fornecido.");
      return;
    }
    $.ajax({
      method: "GET",
      dataType: "json",
      url: `https://api.spotify.com/v1/me`,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
      success: (dados) => {
        console.log(dados);
        const photo = dados.images && dados.images.length > 0 ? dados.images[0].url : null;
        const seguidores = dados.followers.total;
        const name = dados.display_name;
        this.setState({ name });
        this.setState({ photo });
        this.setState({ seguidores });
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      },
    });
  };
  getAlbumCovers = (albumIds) => {
    if (!this.state.token) {
      console.log("Token não fornecido.");
      return;
    }

    $.ajax({
      method: "GET",
      dataType: "json",
      url: `https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`,
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
      success: (dados) => {
        const albumCovers = dados.albums.map((album) => album.images[0].url);
        this.setState({ albumCovers: albumCovers });
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      },
    });
  };

  apitecwebPOST = () => {
    if (!this.state.topTracks.length) {
      console.log("Lista de músicas não encontrada.");
      return;
    }

    const maisEscutada = this.state.topTracks[0]; // seleciona a música mais ouvida
    const data = {
      title: maisEscutada.name,
      artist: maisEscutada.artists[0].name,
    }; // cria um objeto com as informações da música mais ouvida

    $.ajax({
      method: "POST",
      dataType: "json",
      url: "http://localhost:8000/api/musics/",
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
      },
    });

  }

  apitecwebGET = () => {
    $.ajax({
      method: "GET",
      dataType: "json",
      url: "http://localhost:8000/api/musics/",
      headers: {},
      success: (dados) => {
        console.log(dados);
      },
      error: (xhr, status, error) => {
        console.log(xhr);
        console.log(status);
        console.log(error);
      },
    });
  }
  controlarModal = () => {
    this.setState({exibirModal: !this.state.exibirModal})
  } 
  qualtoken() {
    console.log(this.state.token);
  }
  render() {
    // Divide as capas em duas fileiras
    
    const albumCoversRow1 = this.state.albumCovers.slice(0, 5);
    const albumCoversRow2 = this.state.albumCovers.slice(5, 10);

    const artistCoversRow1 = this.state.artistCovers.slice(0, 5);
    const artistCoversRow2 = this.state.artistCovers.slice(5, 10);

    return (
      <div className="App">
        <div className="header">
          <div>
            <button className="login" onClick={() => { this.login(); this.controlarModal(); this.playlist()}}>Perfil</button>
            {this.state.exibirModal&&<div className="quadro_log" >
              <img src={this.state.photo} alt="Foto de perfil" className="foto_perfil" />
                <h1 className="text_profile">{this.state.name}</h1>
                  <div>
                    <h3 className="text_info">Seguidores: {this.state.seguidores}</h3>
                    <h3 className="text_info">Playlists: {this.state.total}</h3>
                  </div>
                </div>}
          </div>
          <div className="title">
            <h1 className="title-text">TecWeb Songs</h1>
            <div className="logo-container">
              <img src="logo.png" alt="Logo" className="logo" />
            </div>
            
            
          </div>
          
        </div>
        {this.state.name && <h2>Olá, {this.state.name}!</h2>}
        <p className="texto">
          Feito na disciplina de Tecnologias Web, nosso site te mostra as suas músicas mais ouvidas no Spotify. Para
          isso, basta logar com sua conta e clicar no botão "Veja suas principais músicas".
        </p>

        <div className="buttons">
          
          <button className="btn btn-primary" onClick={() => (window.location.href = "http://localhost:8888")}>
            Logar com Spotify
          </button>
          <button className="btn btn-primary" onClick={this.topTracksLorde}>
            Veja suas principais músicas
          </button>
          <button className="btn btn-primary" onClick={this.apitecwebPOST}>
            Adicionar a base de dados
          </button>
          <button className="btn btn-primary" onClick={this.topArtists}>
            Veja seus artistas mais ouvidos
          </button>
        </div>
        <div>
          <div className="select">
            <label htmlFor="timeRange">Selecione o período de tempo:   </label>
            <select id="timeRange" value={this.state.timeRange} onChange={this.handleTimeRangeChange}>
              <option value="long_term">All-Time</option>
              <option value="medium_term">6 meses</option>
              <option value="short_term">1 mês</option>
            </select>
          </div>
        </div>
        {this.state.topTracks.length > 0 && (
          <div className="tracks">
            <h2>Suas principais músicas são:</h2>
            <ol>
              {this.state.topTracks.map((track, index) => (
                <li key={index}>
                  {track.name} - {track.artists[0].name}
                  {index < 3 && (
                    <span role="img" aria-label="medal">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  )}
                  <a
                    href={`https://open.spotify.com/track/${track.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="spotify-logo"></div>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
        {this.state.topArtists.length > 0 && (
          <div className="tracks">
            <h2>Seus artistas mais ouvidos são:</h2>
            <ol>
              {this.state.topArtists.map((artist, index) => (
                <li key={index}>
                  {artist.name}
                  {index < 3 && (
                    <span role="img" aria-label="medal">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  )}
                  <a
                    href={`https://open.spotify.com/artist/${artist.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="spotify-logo"></div>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
        {this.state.albumCovers.length > 0 && (
          <div className="album-covers">
            <div className="row">
              {/* Primeira fileira */}
              <div className="col">
                {albumCoversRow1.map((cover, index) => (
                  <img key={index} src={cover} alt={`Capa do Álbum ${index + 1}`} />
                ))}
              </div>

              {/* Segunda fileira */}
              <div className="col">
                {albumCoversRow2.map((cover, index) => (
                  <img key={index} src={cover} alt={`Capa do Álbum ${index + 6}`} />
                ))}
              </div>
            </div>
          </div>
        )}
        {this.state.artistCovers.length > 0 && (
          <div className="album-covers">
            <div className="row">
              {/* Primeira fileira */}
              <div className="col">
                {artistCoversRow1.map((cover, index) => (
                  <img key={index} src={cover} alt={`Capa do Álbum ${index + 1}`} />
                ))}
              </div>

              {/* Segunda fileira */}
              <div className="col">
                {artistCoversRow2.map((cover, index) => (
                  <img key={index} src={cover} alt={`Capa do Álbum ${index + 6}`} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="credits">
          <p>Powered by KNBS 💀</p>
          <p>We are not related to Spotify AB or any of it's partners in any way</p>
        </div>
      </div>
    );
  }
}

export default App;