# Web Crawler

A simple web crawler sample.

## Usage
```
node run url [url...]
```

Example:
```
node app.js http://ajlopez.wordpress.com
```

The processor has three chained message functions:
- `resolver`: Receives a link.
- `download`: Given a link, it downloads its content. The content is the message to the next step.
- `download`: Given a content, it generate a list of links to be processed. Sends them to the first step.

