const express = require('express') //1. ez keresi meg az express-t és importálja be, függvénnyel visszatér egy értékkel
const fileUpload = require('express-fileupload') //6.1 FILE FELTÖLTÉSE (BEJUTTATÁSA) FRONTENDRŐL BACKENDRE
const path = require('path') // ez is egy importálás, ez teszi lehetővé a fájlrendszerben a mozgást.
const fs = require('fs') //5.6 ez keresi meg az fs-t
const app = express() //2. az elérési út kimentése változóba
const port = 9000 //ez a kód végén van behívva az app.listenbe


app.use(fileUpload()); //6.2 Ez egy middleware ( pl. app.use, app.get, app.post, app.delete, app.patch) : ha bejön valamilyen kérés a backendünkbe, akkor minden egyes middleware eldönti, hogy ez a kérés hozzá jött-e, és ha hozzá jött, akkor feldolgozza. Vagy nem hozzá jött, akkor átugorja és a kérés megy tovább a többi middleware-re. App.post és az app.get mutathat ugyanarra a címre. 

app.get('/', (req, res) => { 
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`)) //1. end point: minden egyes alkalmazásunk belépőpontja.
})

app.use('/public', express.static(`${__dirname}/../frontend/public`)) //2. end point: statikus nyilvános mappa elérhetővé tétele

app.get('/data', (req, res) => {
  res.sendFile(path.join(`${__dirname}/data/data.json`)) //4. end point: backend data.json mappáját érjük el vele
})
// 5. ADATOK ELÉRÉSE ID ALAPJÁN
app.get('/data/:id', (req, res) => {  //5.1. ha pl. a böngibe beírjuk: http://127.0.0.1:9000/data/1, kiadja az első objektumot, mert elértünk vele a backendünkhöz.
	//console.log(req.params)
	try { //5.2 String átalakítása (bármit küldünk, az a backenden a data.json objektumában stringként jelenik meg, a szám is.)
		const searchId = parseInt(req.params.id) //ezzel alakítunk stringgé
		//console.log(searchId)

		if(isNaN(searchId)) { //5.3 Ez kell, mert ha a böngibe a data/ után stringet írunk NaN-t ad, ezért kell ez a 400-as hibakód (bad request)
			res.status(400).send("NaN")
		} else { //5.4 else-ággal fedjük le azt, ha numbert kérünk be.
			fs.readFile(`data/data.json`, (err, data) => { //5.5 json fájlokat olvasunk, fs (filesystem)-fájlokat importálunk
				let result = null
				const fileData = JSON.parse(data) //itt a fileData igazi tömb lett, amin végigiterálhatunk
				//console.log(fileData)
				for (let index = 0; index < fileData.length; index++) {
					const element = fileData[index];
					if(element.id === searchId) {
						console.log(element)
						result = element //itt adja vissza a lekért id-jú elementet
					}
				}

				if(result === null) {
					res.status(404).send("nincs ilyen érték") //ha a megadott id nem létezik, akkor ezt adja vissza
				} else {
					res.send(result)
				}
			})
		}

	} catch(error) {
		console.log(error)
		res.send("Elbénáztuk, Béláim")
	}
}) 
//6. FILE FELTÖLTÉSE (BEJUTTATÁSA) FRONTENDRŐL BACKENDRE (mielőtt használjuk ezt, backendre telepítsük az npm install express-fileupload-ot a backend mappába: npm install express-upload)
app.post('/upload', (req, res) => { //6.3
  let uploadedFile; //ez eredetiben let sampleFile
  let savePath; //ez eredetiben let uploadPath
	let imageName; //ezt mi hozzuk létre

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  uploadedFile = req.files.image; 
	imageName =  req.body.name; //6.4 ehhez az image-hez a js-filjban az appendnél használt paramétert rendeljük (formData.append('name', document.querySelector("input[type='text']").value) )
  savePath = `${__dirname}/../frontend/public/${imageName}.jpg`; 

  // Use the mv() method to place the file somewhere on your server
  uploadedFile.mv(savePath, (err) => { //6.5 it helyezzük el a képet a backendbe
    if (err)
      return res.status(500).send(err);

    res.json(imageName); // imageName = "pelda" (ez az értéke)
  });
});

app.listen(port, () => { //3. egy figyelő, itt mondjuk meg az appnak, hogy figyelje a portot, majd kiírja terminalba a szerver linkjét, így klikkelhetünk rá és megnyílik a böngiben, és megjelenik a hello world a viewporton (html-ből)

  console.log(`http://127.0.0.1:${port}`)
})
