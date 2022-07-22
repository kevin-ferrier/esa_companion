export async function getLocalStorageData(key) {
  return await new Promise(function (resolve, reject) {
    chrome.storage.local.get(key, function (result) {
      if (chrome.runtime.lastError) {
        reject(Error(chrome.runtime.lastError.message));
      } else {
        resolve(result[key]);
      }
    });
  });
}

export async function setLocalStorageData(mykey, val) {
  let data = {};
  data[mykey] = val;
  return await new Promise(function (resolve, reject) {
    chrome.storage.local.set(data, function () {
      if (chrome.runtime.lastError) {
        reject(Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

export async function getSyncStorageData(key) {
  return await new Promise(function (resolve, reject) {
    chrome.storage.sync.get(key, function (result) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(Error(chrome.runtime.lastError.message));
      } else {
        resolve(result[key]);
      }
    });
  });
}

export async function setSyncStorageData(mykey, val) {
  let data = {};
  data[mykey] = val;
  return await new Promise(function (resolve, reject) {
    chrome.storage.sync.set(data, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        reject(Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}
