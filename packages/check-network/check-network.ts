const checkNetwork = () => {
    if('connection' in navigator) {
        const connection = navigator.connection as unknown ;
        connection.addEventListener('change', () => {
            const networkStatus = connection.effectiveType;
            if(networkStatus === '2g' || networkStatus === 'slow-2g') {
                console.warn('You are on a slow network connection.');
            }
        })
    }
}


function checkHeartbeat() {
    const startTime = new Date().getTime();
    fetch('/ping')
        .then(response => {
            const endTime = new Date().getTime();
            const latency = endTime - startTime;
            if (latency > 1000) {
                // 确认是弱网
                handleWeakNetwork();
            } else {
               // 网络可能较好，重新评估
                handleGoodNetwork();
            }
        })
        .catch(() => {
            // 网络不稳定或弱网
            handleWeakNetwork();
        })
}