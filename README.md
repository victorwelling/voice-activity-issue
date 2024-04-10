To reproduce the issue:
1. Run `npm install`.
2. In `demo.js`, set the `projectId` constant to a valid Google Cloud project ID.
3. Run `node demo.js`.

You'll the notice the messages are out of order:
```
log: 1.405s Got event 'SPEECH_ACTIVITY_BEGIN'.
log: 2.002s 2 second mark - this should appear before 'SPEECH_ACTIVITY_BEGIN'.
log: 8.524s Got event 'SPEECH_EVENT_TYPE_UNSPECIFIED'.
```

They should appear in this order:

```
log: 2.003s 2 second mark - this should appear before 'SPEECH_ACTIVITY_BEGIN'.
log: 5.190s Got event 'SPEECH_ACTIVITY_BEGIN'.
log: 8.583s Got event 'SPEECH_EVENT_TYPE_UNSPECIFIED'.
```
