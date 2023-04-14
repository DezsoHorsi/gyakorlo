console.log('loaded')
//FILE FELTÖLTÉSE (BEJUTTATÁSA) FRONTENDRŐL BACKENDRE

//1. Script.js-ben csinálunk egy komponenst (form és benne inputok, send = submit button), amit szépen beillesztünk a js-ünbe:
const formComponent = () => `
  <form>
  <input type="text" name="name" placeholder="image name">
  <input type="file" name="file">
  <button>send</button> 
  </form>
`
//2. DOM manipuláció
const rootElement = document.querySelector('#root')
rootElement.insertAdjacentHTML('beforeend', formComponent())
//2. formElement megragadása
const formElement = document.querySelector('form')

//3.  a form alapértelmezett működését letiltjuk úgy, hogy csinálunk rá egy eseményfigyelőt, ahol a formában a gomb működését figyeljük a submit-tal
formElement.addEventListener('submit', (event) => {
  event.preventDefault() //3.1 Az event.preventDefault() fogja meggátolni tulajdonképpen azt, hogy a keresőbe bekerüljön a name-rész.
  console.log('submit')

  const formData = new FormData() //3.2 Ahhoz, hogy tudjuk milyen adataink vannak, amiket fel akarunk tölteni, összegyűjtjük az adatainkat egy formData-ban
  formData.append('name', document.querySelector("input[type='text']").value) //3.3 Appenddel fűzük hozzá a formDataához a különböző értékeket, amiket be akarunk vinni frontendről. A value az az érték, ami a querySelectorból visszatérő html-elem (input[type='text’]) value értéke.
  formData.append('image', document.querySelector("input[type='file']").files[0]) //3.4 Ez mindenképp tömb lesz, még ha csak 1 képet is töltünk fel. 1 kép esetén ez egy elemű tömb, ha 5 kép, akkor 5 elemű. A files[0] gyakorlatilag ennek a files tömböt-t adjuk, itt érjük el azt, hogy fájlokat választunk ki. 

  fetch('/upload', { //4. az összegyűjtött adatok beküldése frontendről backendre a fetch end pointtal
    method: 'POST',
    body: formData //4.1. kulcsérték pár-szerűen, mint egy objektumban - nemcsak szöveget, hanem fájlt is bele tudunk tenni és a backend megkapja
  })
  .then(res => { 
    if (res.status === 200) {
      console.log('success')
      return res.json() //4.2  return  "pelda" itt szedjük ki az értéket, itt adjuk tovább a köv.then-nek
    } else {
      console.log(('ERROR!!!'))
    }
  })
  .then(resData => { //4.3 ebben a callback fn-ben resData néven fogadjuk az előző callback fn visszatérését: resData = "pelda". Így közlekedik az adatom a backend és frontend között.
    rootElement.insertAdjacentHTML('beforeend', 
    `<img src="./public/${resData}.jpg">`)
  })
  .catch(error => console.log(error))
})

/* fetch('http://127.0.0.1:9000/data') 
.then(response => { 
  console.log(response)
  if (response.status === 200) {
    console.log('OK')
  }
  return response.json()
})
.then(responseJson => {
  const data = responseJson
  data.forEach(element => {
    console.log(element.name)
    document.querySelector('#root').insertAdjacentHTML('beforeend', `<h2>${element.name}</h2>`)
  });
}) */