import Footer from "./Footer";
/** Instructions component features information about the usage of the app */
function Instructions() {
  return (
    <div>
      <h2>Käyttöohjeet</h2>
      <p className="instructions-header">
        Tässä lyhyet käyttöohjeet sovelluksen käyttämiseen.
      </p>
      <ol className="instructions-list">
        <li>
          <b>1.</b> Mene "Suunnittele reittisi" välilehdelle.
        </li>
        <li>
          <b>2.</b> Syötä kenttään lähtöpisteesi sekä haluamasi määränpää.
          Klikkaa tämän jälkeen "Hae reitti" nappia.
        </li>
        <li>
          <b>3.</b> Tämän jälkeen pääset tarkastelemaan sinulle ehdotettua
          reittiä. Pääset klikkaamaan reitin varrelta löytyviä kelikameroita,
          <br></br> joista saat ajankohtaista dataa mm. tien kunnosta tai
          ruuhkasta.
        </li>
        <li>
          <b>4.</b> Mikäli reitti ei miellytä, voit painaa "Poista reitti"
          nappia.{" "}
        </li>
      </ol>
      <br></br>
      <Footer />
    </div>
  );
}

export default Instructions;
