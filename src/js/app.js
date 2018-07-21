App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',



  init: function(){
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function(){
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function(){
    $.getJSON("PolTokenSale.json", function(polTokenSale){
      App.contracts.PolTokenSale = TruffleContract(polTokenSale);
      App.contracts.PolTokenSale.setProvider(App.web3Provider);
      App.contracts.PolTokenSale.deployed().then(function(polTokenSale) {
        console.log("Pol Token Sale Address:", polTokenSale.address);
      });
    }).done(function(){
      $.getJSON("PolToken.json",function(polToken){
        App.contracts.PolToken = TruffleContract(polToken);
        App.contracts.PolToken.setProvider(App.web3Provider);
        App.contracts.PolToken.deployed().then(function(polToken) {
          console.log("Pol Token Sale Address:", polToken.address);
        });
        return App.render();
      });
    });
  
  },

  // Load account data
  render: function(){
    web3.eth.getCoinbase(function(err, account){
      if(err === null){
        App.account = account;
        $('#accountAddress').html("Your Account:" + account);
      }
    })
  }
}

$(function(){
  $(window).load(function(){
    App.init();
  })
});