var sessionCache = {}

var detectionPaths = {
  git: ['.git/config'],
  svn: ['.svn/wc.db'],
  hg: ['.hg/requires']
}

var allowedProtocols = ["https:", "http:"]

function checkURLReturns200(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    callback(xhr.readyState === 4 && xhr.status === 200 && xhr.responseURL === url)
  }
  xhr.open('GET', url, true)
  xhr.send(null)
}

function setIcon(repoType, tabId) {
  chrome.pageAction.setIcon({tabId: tabId, path: 'icons/' + repoType + '.png'})  
  chrome.pageAction.show(tabId)   
}

function checkForRepository(url, tabId) {
  var parsedUrl = document.createElement('a')
  parsedUrl.href = url

  if(allowedProtocols.indexOf(parsedUrl.protocol) < 0) {
    return
  }

  var hostWithProtocol = parsedUrl.protocol + '//' + parsedUrl.host

  if(!sessionCache[hostWithProtocol]) {
    Object.keys(detectionPaths).forEach(function(repoType) {
      detectionPaths[repoType].forEach(function(path) {
        checkURLReturns200(hostWithProtocol + '/' + path, function(success) {
          if(success) {
            sessionCache[hostWithProtocol] = repoType
            //make sure it's still the same page in the tab after the request completed
            chrome.tabs.get(tabId, function(info) {
              if(url === info.url) {
                setIcon(repoType, tabId)                
              }
            })
          }
        })
      })
    })
  }
  else {
    setIcon(sessionCache[hostWithProtocol], tabId)    
  }
}

chrome.tabs.onUpdated.addListener(function (tabId , info) {
  if (info.status && info.status === 'complete') {
    chrome.tabs.get(tabId, function(info) {
      checkForRepository(info.url, tabId)      
    })
  }
})