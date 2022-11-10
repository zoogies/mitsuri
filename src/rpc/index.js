const clientID = '969343378535903262';
const DiscordRPC = require('discord-rpc');
const RPC = new DiscordRPC.Client({transport: 'ipc'})

DiscordRPC.register(clientID);

async function setActivity(){
    if(!RPC) return;
    RPC.setActivity({
        details: `dont care + having fun + playing + being silly`,
        state: 'Playing around on zoogies.live servers',
        startTimestamp: Date.now(),
        largeImageKey: 'largecat',
        largeImageText:'Cat Mitsuri',
        smallImageKey:'largecat',
        smallImageText:'Cat Mitsuri',
        instance: false,
        buttons: [
            {
                label:'Take me there!',
                url: `https://zoogies.live`
            }
        ]
    })
}

RPC.on('ready',async () => {
    setActivity();

    setInterval(()=> {
        setActivity();
    }, 15 * 1000)
})

RPC.login({clientID}).catch(err=>console.error(err));

// TODO THIS currently only works on desktop clients