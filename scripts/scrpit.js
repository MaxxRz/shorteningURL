
/* == Menu Activation ==  */
const burger = document.getElementById('buttonBurger');

burger.addEventListener("click", () => {
  burger.classList.contains("burgerActiv") ? burger.classList.remove("burgerActiv") : burger.classList.add("burgerActiv")
});


window.addEventListener("resize", (e) => {
  if (window.innerWidth >= 1024 && burger.classList.contains("burgerActiv")) {
    burger.classList.remove("burgerActiv")
  }
});



/* -------------------------------------------------- */



const urlInput = document.getElementById('input_shorten');
const form = document.forms.url_form;
const containerShowLinks = document.querySelector('.linksShorten');

// Function para generar shortLink
// se utiliza la api TinyURL
async function shortenUrl(urllong) {
  const apiUrl = 'https://api.tinyurl.com/create';

  // realiza la peticion 
  const response = fetch("https://tinyurl.com/api-create.php?url=" + urllong)
    .then(response => response.text())
    .catch(error => console.error("Error:", error));

  const data = await response;

  return data; // El URL acortado
}




// realiza la peticion del form
form.addEventListener('submit', (event) => {
  event.preventDefault();

  let link = form.elements['input_shorten'].value

  // si no hay enlace manda error
  if (link == "") {
    templateError(form);
    return
  }

  // si antes habia error valida y elimina la alerta
  if (form.firstElementChild.classList.contains('shortenError')) {
    form.firstElementChild.classList.remove('shortenError');

    form.firstElementChild.nextSibling.remove();
  }


  // ejecuta la peticion, si sale error no se realiza
  shortenUrl(link)
    .then(shortUrl => {
      if (shortUrl == 'Error') return;
      templateShortLink(link, shortUrl);
    });

  form.reset();
})

// Copiar link
containerShowLinks.addEventListener('click', (event) => {
  if (event.target.nodeName == "BUTTON") {

    let newLink = event.target.previousElementSibling.innerText;
    navigator.clipboard.writeText(newLink);



    event.target.style.background = "hsl(256, 28%, 31%)";
    event.target.innerHTML = "Copied!";

    setTimeout(() => {
      event.target.style.background = "hsl(180, 66%, 49%)";
      event.target.innerHTML = "Copy";
    }, 3000);
  };
});


// template para recuadro de shortlink
const templateShortLink = (link, linkshort) => {

  let template = document.createElement('div');
  template.classList.add('contentShort');
  template.innerHTML = `
  <p>${link}</p>
  <hr>
  <div class="shortNewLink">
  <p>${linkshort}</p>
  <button class="btn btnNewLink">Copy</button>
  </div>`

  containerShowLinks.insertBefore(template, containerShowLinks.firstChild)

  // elimina el exceso de links
  if (containerShowLinks.childElementCount > 2) {
    containerShowLinks.lastChild.remove();
  }
}


// mensaje de error, input vacio
const templateError = (form) => {
  let message = document.createElement('div');
  message.classList.add('shortenErrorText');
  message.innerHTML = `<p class="">Please add a link</p>`;

  form.firstElementChild.classList.add("shortenError");
  form.insertBefore(message, form.firstElementChild.nextSibling);
}
