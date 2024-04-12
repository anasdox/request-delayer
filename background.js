function delayRequest(details) {
  return browser.storage.local.get({ rules: [] }).then((data) => {
    for (let rule of data.rules) {
      if (new RegExp(rule.urlPattern).test(details.url)) {
        console.log(`${rule.urlPattern} Pattern Matched, Delaying request to: ${details.url} for ${rule.delayTime}ms`);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`Proceeding request to: ${details.url}`);
            resolve({ cancel: false });
          }, rule.delayTime);
        });
      }
    }
    return { cancel: false };
  });
}

browser.webRequest.onBeforeRequest.addListener(
    delayRequest,
    {urls: ["<all_urls>"]},
    ["blocking"]
);