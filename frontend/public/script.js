console.log('loaded')

const formComponent = () => `
  <form>
  <input type="text" name="name" placeholder="image name">
  <input type="file" name="file">
  <button>send</button> 
  </form>
`

const rootElement = document.querySelector('#root')
rootElement.insertAdjacentHTML('beforeend', formComponent())

const formElement = document.querySelector('form')

formElement.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log('submit')

  const formData = new FormData()
  formData.append('name', document.querySelector("input[type='text']").value)
  formData.append('image', document.querySelector("input[type='file']").files[0])

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    if (res.status === 200) {
      console.log('success')
      return res.json() // return  "pelda" itt szedjük ki az értéket, itt adjuk tovább a köv.then-nek
    } else {
      console.log(('ERROR!!!'))
    }
  })
  .then(resData => { // ebben a callback fn-ben resData néven fogadjuk az előző callback fn visszatérését: resData = "pelda". Így közlekedik az adatom a backend és frontend között.
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