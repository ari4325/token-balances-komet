const { ERC20_ABI, ENDPOINTS, TOKEN_LISTS } = require('../constants.js');
const axios = require('axios');
const { ethers } = require('ethers');

const initProvider = (chain) => {
    console.log(`Initialising provider for ${chain}`)
    provider = new ethers.providers.JsonRpcProvider(ENDPOINTS[chain])
}

const convertToNumber = (hex, decimals) => {
    if (!hex) return 0 
    return ethers.utils.formatUnits(hex, decimals)
}

const getAllTokenBalances = async (tokenList, wallet) => {
    let proms = []
    let results = []
    for (const tkn of tokenList) {
      const erc20 = new ethers.Contract(tkn.address, ERC20_ABI, provider)
      proms.push(
        erc20.balanceOf(wallet)
      )
    }
    const promiseResults = await Promise.allSettled(proms)
    for (let index = 0; index < promiseResults.length; index++) {
      const bal = convertToNumber(
        promiseResults[index].value,
        tokenList[index].decimals
      )
      if(bal == 0) continue;
      results.push({
        name: tokenList[index].name,
        symbol: tokenList[index].symbol,
        balance: bal,
      })
    }
  
    return results
}

const fetchDatafromCovalent = async(network, address) => {
  var tokens = [];
  var nfts = [];
  let url = `https://api.covalenthq.com/v1/${network}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=true&key=ckey_5149ae94920747bb87dada7f7c3`;
  let response = await axios.get(url);
  //console.log(response.data);
  const items = response.data.data.items;
  //console.log(data);

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

  return {tokens, nfts};
} 

const getTokens = async (chain) => {
    const tokenSource = TOKEN_LISTS[chain]
    console.log(tokenSource);
    const res = await axios.get(tokenSource)
    return res.data;
}
  
const fetchBalances = async (req, res) => {
    const { network, address } = req.query;
    initProvider(network);

    //const tokens = await getTokens(network);
    const balances = await fetchDatafromCovalent(network, address);

    res.status(200).send({
        network, address, balances
    });
}

module.exports = {fetchBalances};