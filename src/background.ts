import MessageSender = chrome.runtime.MessageSender;

function sendMessageToTab(sender:MessageSender, message: any, retries = 5, interval = 100) {
    if (!sender.tab?.id || retries <= 0) {
        console.error('タブID未定義または再試行失敗', message);
        setTimeout(() => sendMessageToTab(sender, message, retries, interval), interval);
        return;
    }
    chrome.tabs.sendMessage(sender.tab.id, message, (response) => {
        if (chrome.runtime.lastError) {
            console.warn('タブ送信失敗、再試行残り', retries - 1);
            setTimeout(() => sendMessageToTab(sender, message, retries - 1, interval), interval);
        } else {
            console.log('タブ送信成功', message, response);
        }
        sendLog(`message:${message.action} response:${response.status}`);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'message1') {
        console.log('message1 が届いた');
        sendLog('message1 が届いた', {
            tabUrl: sender?.tab?.url
        });
        if(!sender.tab?.id){
            sendResponse({ status: 'tabid NG' });
        } else {
            sendResponse({ status: 'message1 ok!' +sender.tab.id });
        }
        sendMessageToTab(sender, { action: 'message2' });
    } else if (message.action === 'message3') {
        console.log('message3 が届いた');
        sendLog('message3 が届いた', {
            tabUrl: sender?.tab?.url
        });
        if(!sender.tab?.id){
            sendResponse({ status: 'tabid NG' });
        } else {
            sendResponse({ status: 'message3 ok!' +sender.tab.id });
        }
        sendMessageToTab(sender, { action: 'message4' });
    }
    return true;
});

const LOG_ENDPOINT = "http://localhost:3001/log";
//const LOG_ENDPOINT = "http://192.168.10.105:3001/log"; // iPadから呼ぶ場合はMacのIPにする
async function sendLog(message: string, meta?: Record<string, unknown>) {
    const payload = {
        source: "background",
        message,
        meta,
    };

    try {
        const res = await fetch(LOG_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.error("sendLog failed:", res.status, res.statusText);
        }
    } catch (err) {
        console.error("sendLog error:", err);
    }
}