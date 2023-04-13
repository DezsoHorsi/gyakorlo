const express = require('express') //1. ez keresi meg az express-t és importálja be, függvénnyel visszatér egy értékkel
const path = require('path') // ez is egy importálás, ez teszi lehetővé a fájlrendszerben a mozgást.
const fs = require('fs') //5.6 ez keresi meg az fs-t
const app = express() //2. az elérési út kimentése változóba
const port = 9000 //ez a kód végén van behívva az app.listenbe

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`)) //1. end point: minden egyes alkalmazásunk belépőpontja.
})

app.use('/public', express.static(`${__dirname}/../frontend/public`)) //2. end point: statikus nyilvános mappa elérhetővé tétele

app.get('/data', (req, res) => {
  res.sendFile(path.join(`${__dirname}/data/data.json`)) //4. end point: backend data.json mappáját érjük el vele
})
// 5. ADATOK ELÉRÉSE ID ALAPJÁN
app.get('/data/:id', (req, res) => { //5.1. ha pl. a böngibe beírjuk: http://127.0.0.1:9000/data/1, kiadja az első objektumot, mert elértünk vele a backendünkhöz.
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

app.listen(port, () => { //3. egy figyelő, itt mondjuk meg az appnak, hogy figyelje a portot, majd kiírja terminalba a szerver linkjét, így klikkelhetünk rá és megnyílik a böngiben, és megjelenik a hello world a viewporton (html-ből)
  console.log(`http://127.0.0.1:${port}`)
})
