const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
var fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const app = express();
var browser;
var page;
var fs = require('fs');
    request = require('request');



app.use(cors());
var count = 0; 

getDealsInfo = dealsUrl => {
    return new Promise(async (resolve, reject) => {
        //var url = `${saleWhale.root}${dealsUrl}`;
        var url = 'https://coinmarketcap.com/exchanges/binance/';
       browser = await puppeteer.launch({
            headless: false
        });
        page = await browser.newPage();
        await page.goto(url, { waitUntil: "load", timeout: 0 });
           var product_details = [];
           await  page.click('.cmc-markets-listing__load-more button');

           setTimeout(async function(){
                await page.click('.cmc-markets-listing__load-more button');
           },2000)
          
            
           setTimeout(function(){
            var html =  page.content();
            html.then(async html => {
                //console.log(html)
                
            
            //console.log(html)
            const $ = cheerio.load(html);
            const table = $(".cmc-table__table-wrapper-outer table tr");  
            const button = $(".cmc-markets-listing__load-more");  

             console.log(table.length)
             var arr = [];
             for(let i = 0; i < table.length; i++){
                 var Currency = $(table[i]).find('td.cmc-table__cell--sort-by__market-pair-base-currency-name a').text();
                 var Pair = $(table[i]).find('td.cmc-table__cell--sort-by__market-pair a').text();
                 var volume = $(table[i]).find('td.cmc-table__cell--sort-by__volume-24-h div.cmc-table__column-market-pair-volume-24h').text();
                 arr.push({
                     market_pair:Pair,
                     currency_name: Currency,
                     volume_24h: volume,
                });

                console.log(Currency,'--',push,'--',volume);
             }
            
            //return false
            //page.close();
            //resolve(deals);
            })
            },6000);
            
        /*} catch (err) {
            resolve("");
        }*/
    });
};

getDealsInfo();




const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server started on port " + port));
