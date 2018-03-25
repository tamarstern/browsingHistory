'use strict';

chrome.runtime.onInstalled.addListener(function() {
		
	var getRandomToken = function() {
		var randomPool = new Uint8Array(32);
		crypto.getRandomValues(randomPool);
		var hex = '';
		for (var i = 0; i < randomPool.length; ++i) {
			hex += randomPool[i].toString(16);
		}
		return hex;
	}

	var getUserId = function() {
	  return new Promise(function (resolve, reject) {
		chrome.storage.local.get('userid', function(items) {
			var userid = items.userid;
			if (userid) {
				resolve(userid);
			} else {
				userid = getRandomToken();
				chrome.storage.local.set({userid: userid}, function() {
					resolve(userid);
				});
			}
		});
	  });
	}
	
  var sendPostToServer = function(siteUrl, now, referrer, iframes, userId) {
		var request = new XMLHttpRequest();
		var params = "url=" + siteUrl + "&time=" + now 
		if(referrer) {
			params = params + "&referrer=" + referrer;
		}
		if(iframes) {
			params = params + "&iframes=" + iframes;
		}
		if(userId) {
			params = params + "&userId=" + userId;
		}
		var url = "http://localhost:3030/api/browsingHistorys";
		request.open("POST", url, true);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		request.setRequestHeader('Access-Control-Allow-Origin', '*');
		request.send(params);
  }
  
  var extractTabUrlAndSendRequest = function(tab, userId) {
	   var now = Date.now();
	   var siteUrl = tab.url;
	   var referrer = tab.referrer;
	   var iframes = tab.iframes;
	   if(siteUrl == 'chrome://newtab/' || siteUrl == 'http://localhost:3000/' || siteUrl == 'about:blank') {
			return;
		}
	   sendPostToServer(siteUrl, now, referrer, iframes, userId);
  }
  
  var extractUrlAndSendRequest = function(tabs) {
	   if(tabs.length > 0) {
			  var tab = tabs[0];
			  extractTabUrlAndSendRequest(tab);
		  }
  }
  
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {schemes: ['https', 'http']},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	  if(changeInfo.status === 'complete') {
		chrome.tabs.executeScript(tabId, { code: "document.referrer;" }, function(result) {
			tab.referrer = result;
			chrome.tabs.executeScript(tabId, { code: '[...document.querySelectorAll("iframe")].map(i => i.src).filter(src => src.startsWith("http"))'}, function(iframeRes) {
				tab.iframes = iframeRes;
				getUserId().then(function (userId) {
					extractTabUrlAndSendRequest(tab, userId);
				});
			});            
        });
	  }
  });

});
