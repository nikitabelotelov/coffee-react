export function checkConnection(): Promise<boolean> {
    return new Promise((resolve) => {
        fetch('https://ifconfig.me/').then((res) => {
            if(res.ok) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(() => {
            resolve(false)
        })
    })
}