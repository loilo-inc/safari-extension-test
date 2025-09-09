function sendMessageWithRetry(message: any, retries = 5, interval = 100) {
    if (retries <= 0) return;
    chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError || !response) {
            console.warn('送信失敗、再試行残り', retries - 1);
            setTimeout(() => sendMessageWithRetry(message, retries - 1, interval), interval);
        } else {
            console.log('送信成功', message, response);
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'message2') {
        console.log('message2 が届いた');
        sendResponse({ status: 'message2 ok' });
        setTimeout(() => {
            sendMessageWithRetry({ action: 'message3' });
        }, 50);
    } else if (message.action === 'message4') {
        console.log('message4 が届いた');
        sendResponse({ status: 'message4 ok' });
    }
});

// ページロード後に message1 を送信
window.addEventListener('load', () => {
    console.log('ページがロードされた');
    setTimeout(() => sendMessageWithRetry({ action: 'message1' }), 200);
});