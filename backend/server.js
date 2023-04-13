const express = require('express') //1. ez keresi meg az express-t és importálja be, függvénnyel visszatér egy értékkel
const path = require('path') // ez is egy importálás, ez teszi lehetővé a fájlrendszerben a mozgást.
const fs = require('fs')
const app = express() //2. az elérési út kimentése változóba
const port = 9000 //ez a kód végén van behívva az app.listenbe

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`)) //1. end point: minden egyes alkalmazásunk belépőpontja.
})

app.use('/public', express.static(`${__dirname}/../frontend/public`)) //2. end point: statikus nyilvános mappa elérhetővé tétele

app.get('/data', (req, res) => {
  res.sendFile(path.join(`${__dirname}/data/data.json`)) //3. end point: backend data.json mappáját érjük el vele
})

app.get('/data/:id', (req, res) => {
	//console.log(req.params)
	try {
		const searchId = parseInt(req.params.id)
		//console.log(searchId)

		if(isNaN(searchId)) {
			res.status(400).send("NaN")
		} else {
			fs.readFile(`data/data.json`, (err, data) => {
				let result = null
				const fileData = JSON.parse(data)
				//console.log(fileData)
				for (let index = 0; index < fileData.length; index++) {
					const element = fileData[index];
					if(element.id === searchId) {
						console.log(element)
						result = element
					}
				}

				if(result === null) {
					res.status(404).send("nincs ilyen érték")
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

app.listen(port, () => { //egy figyelő, itt mondjuk meg az appnak, hogy figyelje a portot, majd kiírja terminalba a szerver linkjét, így klikkelhetünk rá és megnyílik a böngiben, és megjelenik a hello world a viewporton (html-ből)
  console.log(`http://127.0.0.1:${port}`)
})
