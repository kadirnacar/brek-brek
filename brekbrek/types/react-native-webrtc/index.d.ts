/// <reference types="node" />

declare module 'react-native-webrtc' {
  import {Component} from 'react';
  import {ViewStyle} from 'react-native';

  export type RTCSignalingState =
    | 'stable'
    | 'have-local-offer'
    | 'have-remote-offer'
    | 'have-local-pranswer'
    | 'have-remote-pranswer'
    | 'closed';

  export type RTCIceGatheringState = 'new' | 'gathering' | 'complete';

  export type MediaStreamTrackState = 'live' | 'ended';

  export interface RTCDataChannelInit {
    ordered?: boolean;
    maxPacketLifeTime?: number;
    maxRetransmits?: number;
    protocol?: string;
    negotiated?: boolean;
    id?: number;
    // deprecated:
    maxRetransmitTime?: number;
  }

  export interface SourceInfo {
    id: string;
    label: string;
    facing: string;
    kind: string;
    deviceId: string;
  }

  export type RTCIceConnectionState =
    | 'new'
    | 'checking'
    | 'connected'
    | 'completed'
    | 'failed'
    | 'disconnected'
    | 'closed';

  export class MediaStreamTrack {
    private _enabled: boolean;

    enabled: boolean;
    id: string;
    kind: string;
    label: string;
    muted: boolean;
    readonly: boolean;
    readyState: MediaStreamTrackState;
    remote: boolean;
    onended: () => void | undefined;
    onmute: () => void | undefined;
    onunmute: () => void | undefined;
    overconstrained: () => void | undefined;

    constructor();

    stop(): void;
    applyConstraints(): void;
    clone(): void;
    getCapabilities(): void;
    getConstraints(): void;
    getSettings(): void;
    release(): void;

    private _switchCamera(): void;
  }

  export class MediaStream {
    id: string;
    active: boolean;
    onactive: () => void | undefined;
    oninactive: () => void | undefined;
    onaddtrack: () => void | undefined;
    onremovetrack: () => void | undefined;

    private _tracks: MediaStreamTrack[];
    private _reactTag: string;

    constructor(arg: any);

    addTrack(track: MediaStreamTrack): void;
    removeTrack(track: MediaStreamTrack): void;
    getTracks(): MediaStreamTrack[];
    getTrackById(trackId: string): MediaStreamTrack | undefined;
    getAudioTracks(): MediaStreamTrack[];
    getVideoTracks(): MediaStreamTrack[];
    clone(): void;
    toURL(): string;
    release(): void;
  }

  export interface ConfigurationParam {
    username?: string;
    credential?: string;
  }

  export interface ConfigurationParamWithUrls extends ConfigurationParam {
    urls: string[];
  }

  export interface ConfigurationParamWithUrl extends ConfigurationParam {
    url: string;
  }

  export interface RTCPeerConnectionConfiguration {
    iceServers: ConfigurationParamWithUrls[] | ConfigurationParamWithUrl[];
    iceTransportPolicy?: 'all' | 'public' | 'relay';
  }

  export interface EventOnCandidate {
    candidate: RTCIceCandidateType;
  }

  export interface EventOnConnectionStateChange {
    target: {
      iceConnectionState: RTCIceConnectionState;
    };
  }

  export interface EventOnAddStream {
    stream: MediaStream;
  }

  interface RTCDataChannelEventMap {
    bufferedamountlow: Event;
    close: Event;
    error: RTCErrorEvent;
    message: MessageEvent;
    open: Event;
  }

  interface RTCDataChannel extends EventTarget {
    binaryType: string;
    readonly bufferedAmount: number;
    bufferedAmountLowThreshold: number;
    readonly id: number | null;
    readonly label: string;
    readonly maxPacketLifeTime: number | null;
    readonly maxRetransmits: number | null;
    readonly negotiated: boolean;
    onbufferedamountlow: ((this: RTCDataChannel, ev: Event) => any) | null;
    onclose: ((this: RTCDataChannel, ev: Event) => any) | null;
    onerror: ((this: RTCDataChannel, ev: RTCErrorEvent) => any) | null;
    onmessage: ((this: RTCDataChannel, ev: MessageEvent) => any) | null;
    onopen: ((this: RTCDataChannel, ev: Event) => any) | null;
    readonly ordered: boolean;
    readonly priority: RTCPriorityType;
    readonly protocol: string;
    readonly readyState: RTCDataChannelState;
    close(): void;
    send(data: string): void;
    send(data: Blob): void;
    send(data: ArrayBuffer): void;
    send(data: ArrayBufferView): void;
    addEventListener<K extends keyof RTCDataChannelEventMap>(
      type: K,
      listener: (this: RTCDataChannel, ev: RTCDataChannelEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof RTCDataChannelEventMap>(
      type: K,
      listener: (this: RTCDataChannel, ev: RTCDataChannelEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
  }

  declare var RTCDataChannel: {
    prototype: RTCDataChannel;
    new (): RTCDataChannel;
  };

  interface RTCDataChannelEvent extends Event {
    readonly channel: RTCDataChannel;
  }

  declare var RTCDataChannelEvent: {
    prototype: RTCDataChannelEvent;
    new (
      type: string,
      eventInitDict: RTCDataChannelEventInit,
    ): RTCDataChannelEvent;
  };

  interface RTCDtlsTransportEventMap {
    error: RTCErrorEvent;
    statechange: Event;
  }

  export class RTCPeerConnection {
    localDescription: RTCSessionDescriptionType;
    remoteDescription: RTCSessionDescriptionType;

    signalingState: RTCSignalingState;
    private privateiceGatheringState: RTCIceGatheringState;
    private privateiceConnectionState: RTCIceConnectionState;

    onconnectionstatechange: () => void | undefined;
    onicecandidate: (event: EventOnCandidate) => void | undefined;
    onicecandidateerror: (error: Error) => void | undefined;
    oniceconnectionstatechange: (
      event: EventOnConnectionStateChange,
    ) => void | undefined;
    onicegatheringstatechange: () => void | undefined;
    onnegotiationneeded: () => void | undefined;
    onsignalingstatechange: () => void | undefined;

    onaddstream: (event: EventOnAddStream) => void | undefined;
    onremovestream: () => void | undefined;

    private _peerConnectionId: number;
    private _localStreams: MediaStream[];
    private _remoteStreams: MediaStream[];
    private _subscriptions: any[];

    private _dataChannelIds: any;

    constructor(configuration: RTCPeerConnectionConfiguration);

    addStream(stream: MediaStream): void;

    removeStream(stream: MediaStream): void;

    createOffer(): Promise<RTCSessionDescriptionType>;

    createAnswer(): Promise<RTCSessionDescriptionType>;

    setConfiguration(configuration: RTCPeerConnectionConfiguration): void;

    setLocalDescription(
      sessionDescription: RTCSessionDescriptionType,
    ): Promise<void>;

    setRemoteDescription(
      sessionDescription: RTCSessionDescriptionType,
    ): Promise<void>;

    addIceCandidate(candidate: RTCIceCandidateType): Promise<void>;

    getStats(selector?: MediaStreamTrack | null): Promise<any>;

    getLocalStreams(): MediaStream[];

    getRemoteStreams(): MediaStream[];

    close(): void;

    private _getTrack(
      streamReactTag: string,
      trackId: string,
    ): MediaStreamTrack;

    private _unregisterEvents(): void;

    private _registerEvents(): void;

    createDataChannel(label: string, dataChannelDict?: any): RTCDataChannel;
  }

  export class RTCIceCandidateType {
    candidate: string;
    sdpMLineIndex: number;
    sdpMid: string;
  }

  export class RTCIceCandidate extends RTCIceCandidateType {
    constructor(info: RTCIceCandidateType);

    toJSON(): RTCIceCandidateType;
  }

  export class RTCSessionDescriptionType {
    sdp: string;
    type: string;
  }

  export class RTCSessionDescription extends RTCSessionDescriptionType {
    constructor(info: RTCSessionDescriptionType);
    toJSON(): RTCSessionDescriptionType;
  }

  export interface MandatoryMedia {
    minWidth: number;
    minHeight: number;
    minFrameRate: number;
  }

  export interface MediaSources {
    sourceId: string;
  }

  export interface MediaTrackConstraints {
    mandatory: MandatoryMedia;
    facingMode: 'user' | 'environment';
    optional: MediaSources[];
  }

  export interface MediaStreamConstraints {
    video?: boolean | MediaTrackConstraints;
    audio?: boolean;
  }

  export class mediaDevices {
    ondevicechange: () => void | undefined;

    static enumerateDevices(): Promise<any>;

    static getUserMedia(
      constraints: MediaStreamConstraints,
    ): Promise<MediaStream | boolean>;
  }

  export function registerGlobals(): void;

  export interface RTCViewProps {
    streamURL: string;
    mirror?: boolean;
    zOrder?: number;
    objectFit?: 'contain' | 'cover';
    style?: ViewStyle;
  }

  export class RTCView extends Component<RTCViewProps, any> {}
}
