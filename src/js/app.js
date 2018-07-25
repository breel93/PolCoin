App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokenSold: 0,
  tokensAvailable: 750000,


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
        App.listenForEvents();
        return App.render();
      });
    });
  
  },

   // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.PolTokenSale.deployed().then(function(instance) {
      instance.Sell({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },

  // Load account data
  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader  = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    })

    // Load token sale contract
    App.contracts.PolTokenSale.deployed().then(function(instance) {
      polTokenSaleInstance = instance;
      return polTokenSaleInstance.tokenPrice();
    }).then(function(tokenPrice) {
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
      return polTokenSaleInstance.tokenSold();
    }).then(function(tokenSold) {
      App.tokenSold = tokenSold.toNumber();;
      $('.tokens-sold').html(App.tokenSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (Math.ceil(App.tokenSold) / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      // Load token contract
      App.contracts.PolToken.deployed().then(function(instance) {
        polTokenInstance = instance;
        return polTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.pol-balance').html(balance.toNumber());
        App.loading = false;
        loader.hide();
        content.show();
      })
    });
  },


  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.PolTokenSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens bought...")
      $('form').trigger('reset') 
    
    });
  }
}



$(function(){
  $(window).load(function(){
    App.init();
  })
});