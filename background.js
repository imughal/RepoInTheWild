var sessionCache = {}

var detectionPaths = {
  git: ['.git/config'],
  svn: ['.svn/wc.db'],
  hg: ['.hg/requires']
}

var repoTypeCount = Object.keys(detectionPaths).length

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

  if(sessionCache[hostWithProtocol] === undefined) {
    var alreadyChecked = []
    Object.keys(detectionPaths).forEach(function(repoType) {
      detectionPaths[repoType].forEach(function(path) {
        checkURLReturns200(hostWithProtocol + '/' + path, function(success) {
          alreadyChecked.push(repoType)

          if(success) {
            sessionCache[hostWithProtocol] = repoType
            //make sure it's still the same page in the tab after the request completed
            chrome.tabs.get(tabId, function(info) {
              if(url === info.url) {
                setIcon(repoType, tabId)                
              }
            })
          }
          else if(alreadyChecked.length === repoTypeCount && sessionCache[hostWithProtocol] === undefined)
          {
            //set it to false to make sure it doesn't get queried again during this session
            sessionCache[hostWithProtocol] = false
          }
        })
      })
    })
  }
  else if(sessionCache[hostWithProtocol] !== false){
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