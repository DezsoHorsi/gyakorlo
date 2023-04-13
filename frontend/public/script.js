

console.log('loaded')
//ADAT KIÍRATÁSA A BÖNGÉSZŐBE BACKENDBŐL (data.json)
fetch('http://127.0.0.1:9000/data') //1. feltárcsázzuk a szervert a data-val, hogy hozzájussunk az adatunkhoz
.then(response => { // 2. itt kapunk egy response-t, egy csomó adatot a konzolba backendről
  console.log(response) 
  if (response.status === 200) {
    console.log('OK') // 3. hibakód megírása (if), a böngésző konzoljában kiírja, hogy OK
  }
  return response.json() //4. a response-ból (az adatokból) csinálunk egy json-t
})
.then(responseJson => {  //5. itt már hivatkozunk a response.json()-ra, itt fogjuk elérni az adatokat, csak akkor fut le, ha létezik adat a data.json fájlban
  const data = responseJson //6. az adatokat kimentjük egy data nevű változóba
  data.forEach(element => { //7. végigiterálunk az adatokon és kiíratjuk konzolra a sör nevét (element.name)
    console.log(element.name)
    document.querySelector('#root').insertAdjacentHTML('beforeend', `<h2>${element.name}</h2>`) //8. DOM-manipulálás azért, hogy a sör nevét a viewportba is kiírja.
  });
})