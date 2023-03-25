// // importing puppeteer
var puppeteer = require("puppeteer");
const fs = require('fs');

async function extractData(){

    const browser = await puppeteer.launch({headless: true});

    const page = await browser.newPage();

    await page.goto('https://www.github.com/trending');

    await page.waitForSelector('h1 a');
    await page.waitForSelector('.col-9');
    await page.waitForSelector('.repo-language-color + span');


    const trending_repo = await page.evaluate( function(){
        var tittle = Array.from(document.querySelectorAll('h1 a'));
        var desc = Array.from(document.getElementsByClassName('col-9'));
        var urls = Array.from(document.querySelectorAll('h1 a'));
        var star = Array.from(document.querySelectorAll(".f6 .Link--muted:first-of-type"));
        var fork = Array.from(document.querySelectorAll(".f6 .Link--muted:last-of-type"));
        var languages = Array.from(document.querySelector(".repo-language-color + span"));

        const data = [] 

        for(var i = 0; i < desc.length; i++){
            var title = tittle[i].innerText.trim();
            var description = desc[i].innerText.trim();
            var url = urls[i].getAttribute("href");
            var stars = star[i].innerText.trim();
            var forks = fork[i].innerText.trim();
            var language = "";
            data.push({ title, description, url, stars, forks, language});
        }
        
        return data;
    });

    console.log('Trending repos are ', trending_repo);
    

    //Saving the JSOn file
    fs.writeFile('data.json', JSON.stringify(trending_repo), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Data saved as data.json");
        }
    });

    
    //Dev data
    await page.goto('https://github.com/trending/developers/javascript?since=daily');

        async function extratctDevData() {

            await page.waitForSelector('.css-truncate');
            
            const dev_repo = await page.evaluate( function(){
                var names = Array.from(document.querySelectorAll('.h3 a'));
                var user_names = Array.from(document.querySelectorAll('.col-md-6 a'));
                var repo_names = Array.from(document.getElementsByClassName("css-truncate"));
                var des = Array.from(document.querySelectorAll('.f6.color-fg-muted.mt-1'));

                var devData = [];

            for(var i = 0; i < names.length; i++){
                var name = names[i].innerHTML.trim();
                var username = user_names[i].innerText.trim();
                var Repo_Name = repo_names[i].innerText.trim();
                var description = des[i].innerText.trim();
                devData.push({name, username, Repo_Name, description});
            }
            return devData;
            });

            console.log('Dev repos are ', dev_repo);

            //Saving the JSOn file
            fs.writeFile('dev_repo.json', JSON.stringify(dev_repo), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Data saved as dev_repo.json");
                }
            });
        }


       await extratctDevData();
        await browser.close();

        
    
}

extractData();


