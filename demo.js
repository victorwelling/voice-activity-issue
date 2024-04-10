import {v2} from "@google-cloud/speech";
import {createReadStream} from "node:fs";

const speechClient = new v2.SpeechClient();
const streamingRecognize = speechClient._streamingRecognize();
const projectId = ""; // Make sure to provide a project ID for this to work

const config = {
    recognizer: `projects/${projectId}/locations/global/recognizers/_`,
    streamingConfig: {
        config: {
            model: "long", // Changing this to telephony for example will not trigger the issue
            languageCodes: ["nl-NL"], // Changing this to en-US for example will not trigger the issue
            explicitDecodingConfig: {
                encoding: "LINEAR16",
                sampleRateHertz: 8000,
                audioChannelCount: 1,
            },
        },
        streamingFeatures: {
            enableVoiceActivityEvents: true,
        },
    },
};

streamingRecognize.write(config);

console.time("log");

streamingRecognize.on("data", ({speechEventType}) => console.timeLog("log", `Got event '${speechEventType}'.`));

// Read the audio in chunks of 1600 bytes, or 100ms of audio
const readStream = createReadStream("./speech.wav", { highWaterMark: 1600 });

readStream.on("data", (audio) => {
    streamingRecognize.write({audio});

    // Pausing and resuming the stream after 100ms, to simulate streaming from a realtime source like a microphone
    readStream.pause();
    setTimeout(() => readStream.resume(), 100);
});

readStream.on("end", () => streamingRecognize.end());

// The audio doesn't include speech until after 5 seconds, so as this message is logged after 2 seconds, it should always come first
setTimeout(() => console.timeLog("log", "2 second mark - this should appear before 'SPEECH_ACTIVITY_BEGIN'."), 2000);
