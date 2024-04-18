import Footer from "./Footer";
function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="./src/banneri-kuva-2.png" className="Banner-image" />
        <h3>Ajankohtaiset päivitykset</h3>
        <p className="Left-align">
          <b>18.4.2024</b>
          <br></br>
          Sovellukseen on tullut merkittäviä päivityksiä. Nyt käyttäjämme
          pääsevät valitsemaan<br></br> reitin varrelta kelikameroita joista saa
          tarkempaa tietoa esimerkiksi tien kunnosta tai ruuhkista.<br></br>
          Tämä uusi päivitys auttaa käyttäjiämme suunnittelemaan reitiinsä
          paremmin!
        </p>
        <p className="Left-align">
          <b>16.4.2024</b>
          <br></br>
          Sovelluksemme on saanut uudistetun ulkoasun!
        </p>
      </header>
      <Footer />
    </div>
  );
}

export default Home;
