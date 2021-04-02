// 858465360c854232c8a8f6e84b70e75f
// http://api.coinlayer.com/api/live?access_key=858465360c854232c8a8f6e84b70e75f - live

const baseUrl = `https://api.coinlayer.com/api/`;
const apiKey = `858465360c854232c8a8f6e84b70e75f`;

// top level function that calls and gets data and calls formatting functions
function getCryptoData() {
  fetch(`${baseUrl}live?expand=1&access_key=${apiKey}`)
    .then(function (response) {
      if (!response.ok) {
        console.log(response);
        return new Error(response);
      }
      return response.json();
    })
    .then(function (data) {
      processData(data.rates);
    });
}

// function for processing rates data
function processData(rates) {
  let coinArray = [];
  for (var key in rates) {
    let coinName = key;
    let coinValue = rates[key];

    let newCoin = {
      name: coinName,
      rate: coinValue.rate,
      change: coinValue.change,
      change_pct: coinValue.change_pct,
    };

    coinArray.push(newCoin);
  }

  let sortedCoinArray = coinArray.sort((a, b) => a.change_pct - b.change_pct);
  let top10Losers = sortedCoinArray.slice(0, 10);
  let top10Gainers = sortedCoinArray.slice(-10, sortedCoinArray.length);

  top10Gainers.reverse().map((coinData) => processWinner(coinData));
  top10Losers.map((coinData) => processLoser(coinData));
}
//creates the template card and appends it to winnersList

function processWinner(coinData) {
  const winnerList = document.getElementById("winnersList");
  const coinImage = getCoinImage(coinData.name);
  const winnerCard = `<div class>
    <div class="list d-flex align-items-center border-bottom p-2 pl-3 pr-3 mt-0">
      <img class="w-6 h-6" src="${coinImage}" alt="${coinData.name} icon">
      <div class="w-100 ml-3">
        <div class="d-flex justify-content-between align-items-center">
          <p class="mt-1 mb-0 font-weight-semibold">${coinData.name}/USD</p>
          <span class="ml-auto fs-15 mb-0 font-weight-semibold">${formatCurrency(
            coinData.rate
          )}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-success tx-13">+${coinData.change_pct.toFixed(
            4
          )}%</span>
          <small class="text-muted ml-auto">${coinData.change.toFixed(
            4
          )} USD</small>
        </div>
      </div>
    </div>
  </div>`;
  let template = htmlToElement(winnerCard);
  winnerList.appendChild(template);
  return;
}

function processLoser(coinData) {
  const winnerList = document.getElementById("losersList");
  const coinImage = getCoinImage(coinData.name);
  const loserCard = `<div class>
    <div class="list d-flex align-items-center border-bottom p-2 pl-3 pr-3 mt-0">
      <img class="w-6 h-6" src="${coinImage}" alt="${coinData.name} icon">
      <div class="w-100 ml-3">
        <div class="d-flex justify-content-between align-items-center">
          <p class="mt-1 mb-0 font-weight-semibold">${coinData.name}/USD</p>
          <span class="ml-auto fs-15 mb-0 font-weight-semibold">${formatCurrency(
            coinData.rate
          )}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <span class="text-danger tx-13">${coinData.change_pct.toFixed(
            4
          )}%</span>
          <small class="text-muted ml-auto">${coinData.change.toFixed(
            4
          )} USD</small>
        </div>
      </div>
    </div>
  </div>`;

  let template = htmlToElement(loserCard);

  winnerList.appendChild(template);
  return;
}

function htmlToElement(htmlString) {
  let template = document.createElement("template");
  template.innerHTML = htmlString;
  return template.content.firstChild;
}

function formatCurrency(value) {
  let currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 4,
  }).format(value);
  return currency;
}
// checking to see if image exists & provide default image if not
function getCoinImage(name) {
  let image = new Image();
  image.src = `./img/svg/color/${name}.svg`;
  if (image.width == 0) {
    return `./img/svg/black/USD.svg`;
  } else {
    return `./img/svg/color/${name}.svg`;
  }
}

getCryptoData();
