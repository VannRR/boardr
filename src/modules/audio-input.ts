import { ChannelCount } from "../types";

export class AudioInput {
  private stream: MediaStream | null;
  private context: AudioContext | null;
  private source: MediaStreamAudioSourceNode | null;
  private splitter: ChannelSplitterNode | null;
  private analyserNode: AnalyserNode | null;
  private fftSize: number;
  private dataArray: Float32Array;
  private channelCount: ChannelCount;
  private activeChannel: number;
  constructor() {
    this.stream = null;
    this.context = null;
    this.source = null;
    this.splitter = null;
    this.analyserNode = null;
    this.fftSize = 2048;
    this.dataArray = new Float32Array(this.fftSize);
    this.channelCount = 0;
    this.activeChannel = -1;
  }

  async setup() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      if (this.stream === null) {
        throw new Error("No media stream");
      }

      this.context = new AudioContext();

      this.source = this.context.createMediaStreamSource(this.stream);

      if (this.source === null) {
        throw new Error("No media stream source");
      }

      this.channelCount = this.source.channelCount;

      if (this.channelCount <= 0) {
        throw new Error("No audio channels");
      }

      this.splitter = this.context.createChannelSplitter(this.channelCount);
      this.source.connect(this.splitter);

      this.analyserNode = this.context.createAnalyser();
      this.analyserNode.fftSize = this.fftSize;

      this.setActiveChannel(0);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  isActive() {
    return this.stream !== null && this.stream.active;
  }

  getChannelCount() {
    return this.channelCount;
  }

  getActiveChannel() {
    return this.activeChannel;
  }

  setActiveChannel(channel: number) {
    if (channel < 0 || channel >= this.channelCount) {
      throw new Error("Invalid channel");
    } else if (this.splitter === null) {
      throw new Error("No splitter");
    } else if (this.analyserNode === null) {
      throw new Error("No analyser node");
    } else if (channel !== this.activeChannel) {
      if (this.activeChannel !== -1) {
        this.analyserNode.disconnect();
      }
      this.activeChannel = channel;
      this.splitter.connect(this.analyserNode, channel, 0);
    }
  }

  getFFTSize() {
    return this.fftSize;
  }

  getSampleRate() {
    if (this.context) {
      return this.context.sampleRate;
    } else {
      throw new Error("No audio context");
    }
  }

  updateDataArray() {
    if (this.analyserNode) {
      this.analyserNode.getFloatTimeDomainData(this.dataArray);
    } else {
      throw new Error("No AnalyserNode");
    }
  }

  setDataArray(length: number) {
    this.dataArray = new Float32Array(length);
  }

  getDataArray() {
    return this.dataArray;
  }
}
