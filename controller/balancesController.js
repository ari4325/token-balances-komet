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
      results.push({
        name: tokenList[index].name,
        symbol: tokenList[index].symbol,
        balance: bal,
      })
    }
  
    return results
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

    const tokens = await getTokens(network);
    const balances = await getAllTokenBalances(tokens, address);

    res.status(200).json({
        network, address, balances
    });
}

module.exports = {fetchBalances};