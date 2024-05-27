function delayRequest(details) {
  return browser.storage.local.get({ rules: [] }).then((data) => {
    for (let rule of data.rules) {
      if (new RegExp(rule.urlPattern).test(details.url)) {
        console.log(`${rule.urlPattern} Pattern Matched, Delaying request to: ${details.url} for ${rule.delayTime}ms`);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`Proceeding request to: ${details.url}`);
            browser.webRequest.onCompleted.addListener(
              (responseDetails) => {
                const modifiedBody = rule.overwriteResponseBody || responseDetails.response.body;
                const modifiedStatusCode = rule.overwriteStatusCode || responseDetails.statusCode;
                const modifiedResponse = {
                  statusCode: modifiedStatusCode,
                  headers: responseDetails.responseHeaders,
                  body: modifiedBody
                };
                browser.webRequest.onCompleted.removeListener(this);
                console.log(`Modified response for ${rule.urlPattern}:`, modifiedResponse);
                resolve({ cancel: false });
              },
              { urls: [details.url] },
              ["response"]
            );
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
