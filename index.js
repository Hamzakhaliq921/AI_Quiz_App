fetch(`${CONFIG.BASE_URL}/endpoint?apiKey=${CONFIG.API_KEY}`)
  .then(res => res.json())
  .then(data => console.log(data));