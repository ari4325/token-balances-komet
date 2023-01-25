const networkInput = document.getElementById('network');
const addressInput = document.getElementById('address');
const searchBtn = document.getElementById('search');
const prettify = document.getElementById('json');
search.addEventListener("click", async() => {
    
    const network = networkInput.value;
    const address = addressInput.value;

    console.log(network);
    console.log(address);

    // let response = await fetch(`http://127.0.0.1:8080/balances?network=${network}&address=${address}`);
    // const data = await response.json();
    let url = `https://api.covalenthq.com/v1/${network}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=true&key=ckey_5149ae94920747bb87dada7f7c3`;
    let response = await (await fetch(url)).json();
    console.log(response);
    
    const items = response.data.items;
    //console.log(data);
    let tokens = [];
    let nfts = [];
    items.forEach(async (obj) => { 
        //console.log(obj);
        if (obj.type === 'nft') {
        let nft = {
                "name": obj.contract_name,
                "balance": obj.balance,
                "data": obj.nft_data,
                "logo": obj.logo_url,
            }
            nfts = [...nfts, nft];
        } else {
            let token = {
                "name": obj.contract_name,
                "token_balance": obj.balance,
                "usd_balance": obj.quote,
                "logo": obj.logo_url,
            }
            tokens = [...tokens, token];
        }
    });

    prettify.textContent += JSON.stringify(tokens, undefined, 2);
    prettify.textContent += JSON.stringify(nfts, undefined, 2);

})
