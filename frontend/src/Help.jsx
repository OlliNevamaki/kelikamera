import Footer from "./Footer";
/**Function for a component and a page view Help that displays information for the user to make contact to us */
function Help() {
  return (
    <div>
      <h2>Tuki</h2>
      <p>
        Mikäli sinulla herää, jotain kysyttävää tai haluat kertoa<br></br>
        parannusehdotuksesi, ole hyvä ja ota rohkeasti meihin yhteyttä!<br></br>
        Pyrimme vastaamaan mahdollisimman nopeasti.
      </p>
      <p>
        Tuki on tavoitettavissa seuraavanlaisesti: <br></br>
        <b>Ma-pe klo. 10-15</b>
      </p>

      <h2>Yhteystiedot</h2>
      <ol>
        <li>
          Puhelinnumero:<b> +358 123456789</b>
        </li>
        <li>
          Sähköpostiosoite: <b>kelikamera@tuki.fi</b>
        </li>
      </ol>
      <br></br>
      <Footer />
    </div>
  );
}

export default Help;
