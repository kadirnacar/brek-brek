import { AddAlarm } from "@material-ui/icons";
import { socket } from "./WebSocketClient";

WritableStream
export class WebRtcConnection {
    constructor(id: string) {
        this.id = id;
    }

    public peer: RTCPeerConnection;
    private dataChannel: RTCDataChannel;
    private id: string;
    private audioStream: MediaStream;
    public onReady?: any;

    public async start() {
        this.peer = new RTCPeerConnection({ peerIdentity: this.id });

        this.peer.onicecandidate = this.onCandidate.bind(this);
        this.peer.ondatachannel = this.handleDataChannel.bind(this);
        this.peer.onconnectionstatechange = this.handleConnectionState.bind(this);
        this.dataChannel = this.peer.createDataChannel("data-channel");
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        }).then((a: MediaStream) => {
            if (this.onReady) {
                this.onReady();
            }
            const recorder = new MediaRecorder(a);
            recorder.ondataavailable = async e => {
                // console.log(e.data);

                // if (this.dataChannel)
                //     this.dataChannel.send("denem");
            };
            recorder.start(1000);
        })

    }
    async waitUntilIceGatheringStateComplete(peerConnection) {
        if (peerConnection.iceGatheringState === 'complete') {
            return;
        }

        const timeToHostCandidates = 3000;

        const deferred: any = {};
        deferred.promise = new Promise((resolve, reject) => {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });

        const timeout = setTimeout(() => {
            peerConnection.removeEventListener('icecandidate', this.onCandidate);
            deferred.reject(new Error('Timed out waiting for host candidates'));
        }, timeToHostCandidates);

        const onIceCandidate = ({ candidate }) => {
            if (!candidate) {
                clearTimeout(timeout);
                peerConnection.removeEventListener('icecandidate', this.onCandidate);
                deferred.resolve();
            }
        }

        peerConnection.addEventListener('icecandidate', onIceCandidate);

        await deferred.promise;
    }
    public async doOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        await this.waitUntilIceGatheringStateComplete(this.peer);
    }

    public async setAnswer(data) {
        await this.peer.setRemoteDescription(data.localDescription);
        const originalAnswer = await this.peer.createAnswer();
        const updatedAnswer = new RTCSessionDescription({
            type: 'answer',
            sdp: originalAnswer.sdp
        });
        await this.peer.setLocalDescription(updatedAnswer);
    }

    public getInfo() {
        return {
            iceConnectionState: this.peer.iceConnectionState,
            localDescription: this.descriptionToJSON(this.peer.localDescription, true),
            remoteDescription: this.descriptionToJSON(this.peer.remoteDescription),
            signalingState: this.peer.signalingState
        };
    }

    private descriptionToJSON(description, shouldDisableTrickleIce?) {
        return !description ? {} : {
            type: description.type,
            sdp: shouldDisableTrickleIce ? this.disableTrickleIce(description.sdp) : description.sdp
        };
    }

    private disableTrickleIce(sdp) {
        return sdp.replace(/\r\na=ice-options:trickle/g, '');
    }

    onCandidate(ev: RTCPeerConnectionIceEvent) {
        console.log("onCandidate", ev.candidate);
    }

    handleConnectionState(ev: Event) {
        console.log("handleConnectionState", this.peer);
        switch (this.peer.connectionState) {
            case "disconnected":
            case "failed":
            case "closed":
                this.dataChannel.removeEventListener('message', this.handleOnData);
                this.dataChannel.close();
                break;
        }
    }

    handleDataChannel(ev: RTCDataChannelEvent) {
        const channel = ev.channel;
        console.log("channel", channel)

        setTimeout(() => {
            this.dataChannel = channel;
            this.dataChannel.addEventListener('message', this.handleOnData.bind(this));
            // const queueStartTime = Date.now();
            // const chunkSizeInBytes = (this.chunkSize) * 1024;
            // const loops = uploadedBytes / chunkSizeInBytes;
            // const rem = uploadedBytes % chunkSizeInBytes;

            // try {
            //     dataChannel.send(`#START ${chunkSize.value}`);

            //     var data = new Array(chunkSizeInBytes + 1).join('.');
            //     for (let i = 0; i < loops; i++) {
            //         dataChannel.send(data);
            //     }

            //     if (rem) {
            //         dataChannel.send(data);
            //     }

            //     dataChannel.send('#STOP');
            //     const queueDuration = Date.now() - queueStartTime;
            //     console.log(`Queued ${uploadedBytes} bytes in ${queueDuration} ms`);
            // } catch (e) {
            //     console.log('Failed to send data over dataChannel :', e);
            //     peerConnection.close();
            //     closeDatachannel();
            //     resetButtons();
            //     alert(e);
            // }
        }, 200);
    }

    handleOnData(ev: MessageEvent) {

    }
}