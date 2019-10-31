const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cheerio = require("cheerio");
const rp = require('request-promise');
app.use(bodyParser.json())
var request = require('request');
app.set('views', __dirname+'/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){

  
	request('https://web-api.coinmarketcap.com/v1/exchange/market-pairs/latest?aux=num_market_pairs,category,fee_type,market_url,currency_name,currency_slug&convert=USD,BTC&limit=600&market_status=active&slug=binance&start=1', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const fs = require('fs');
        var data = JSON.parse(body).data.market_pairs;
        console.log(data.length)
         var arr = [];
        for(let i = 0; i < data.length; i++){
        	console.log(data[i].market_pair,'--',data[i].market_pair_base.currency_name,'--',data[i].quote.USD.volume_24h);

        	arr.push({
        		 market_pair: data[i].market_pair,
        		 currency_name: data[i].market_pair_base.currency_name,
        		 volume_24h: data[i].quote.USD.volume_24h,
        	})

        }

		/*fs.appendFile('data.json', body, function (err) {
		  if (err) throw err;
		  console.log('Saved!');
		});*/
		  res.render('index',{result:arr});
     }

})
	
});


coinmarketcap = () => {
	return new Promise((resolve, reject) => {
	var url  = "";
		rp(url)
	  .then(function(html){
	        const $ = cheerio.load(html);     

	         const table = $(".cmc-table__table-wrapper-outer table tr");  

	         console.log(table.length)
	         for(let i = 0; i < table.length; i++){
	         	 var Currency = $(table[i]).find('td.cmc-table__cell--sort-by__market-pair-base-currency-name a').text();
	         	 var Pair = $(table[i]).find('td.cmc-table__cell--sort-by__market-pair a').text();
	         	 var volume = $(table[i]).find('td.cmc-table__cell--sort-by__volume-24-h div.cmc-table__column-market-pair-volume-24h').text();
	            console.log(Currency,'--',Pair,'--',volume,'--'); 
	         }
		    



    	}).catch(err => console.log(err));
	});
};


//coinmarketcap();


app.listen(port, () => console.log(`Example app listening on port ${port}!`))