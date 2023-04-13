

console.log('loaded')
//ADAT KIÍRATÁSA A BÖNGÉSZŐBE BACKENDBŐL (data.json)
fetch('http://127.0.0.1:9000/data') //feltárcsázzuk a szervert a data-val
.then(response => { // itt kapunk egy csomó adatot a konzolba backendről
  console.log(response) 
  if (response.status === 200) {
    console.log('OK') // a böngésző konzoljában kiírja, hogy OK
  }
  return response.json()
})
.then(responseJson => {  // itt fogjuk elérni az adatokat, csak akkor fut le, ha létezik adat a data.json fájlban
  const data = responseJson
  data.forEach(element => {
    console.log(element.name)
    document.querySelector('#root').insertAdjacentHTML('beforeend', `<h2>${element.name}</h2>`)
  });
})