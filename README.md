# Ada Assistant

Ada is a tiny voice assistant made with Porcupine and Wit.ai.

Works on Windows 10 x64.

## Requirements

- Node.js v14+
- Python 3.6
- SoX 14.4.1

Both of these must be add in [PATH](https://en.wikipedia.org/wiki/PATH_(variable)).

## Installation

You need to install the Python packages in the `hotwords/` directory (`pip install -r requirements.txt`).

You need to install the Node.js packages in the root directory with `npm install`.

## Configuration

Create a `.env` file in the root directory according to `.env.example`.
- `API_KEY`: your Wit.ai API key
- `SILENCES_COUNT`: silence count before end of listening
- `SPOTIFY_CLIENT_ID`: your Spotify client ID
- `SPOTIFY_CLIENT_SECRET`: your Spotify client secret
- `WEB_SERVER_PORT`: local web server IP (e.g. `8080`)
- `ROOT_URL`: root web server URL (e.g. `http://localhost:8080/`)
- `OPENWEATHERMAP`: your OpenWeatherMap API key ([see here](https://openweathermap.org/))
- `OPENWEATHERMAP`: your OpenWeatherMap API key ([see here](https://openweathermap.org/))

You can customize the `configs/apps.js` file where are stored the available applications, and you can edit the `configs/jokes.json` files in order to edit the jokes.

You can edit your tram line and your tram stop by editing this part of the `configs/config.json` file: `"divia-api":{"defaultStop":{"lineName":"T1","stopName":"Grésilles"}}`

## Features

After installing the requirements, the packages, and completing the configuration, you can run Ada with `npm start`.

To talk with ada, just say "OK Ada", wait for the beep, and then talk. Ada currently only supports French, but you could change that, see Modifications section.

Example of commands:
- Salut / Bonjour / Coucou / ...
- Comment vas-tu ? / Ça va ? / ...
- Musique suivante / Met la chanson d'après / ...
- Musique précédente / Met la chanson d'avant / ...
- Pause / Arrête la musique / ...
- Play / Remet la musique / ...
- Augmente le volume / Monte le volume de 5% / ...
- Descend le volume / Baisse le volume de 10% / ...
- Met le volume à 30% / ...
- Mute / Coupe le son / ...
- Unmute / Remet le son / ...
- Prochain passage du tram direction Quetigny / ... (only with Divia, see Configuration section)
- Chut / Tais-toi / ...
- Ouvre Spotify / ... (you need to configure applications, see Configuration section)
- Cherche "phoque" sur Google / ...
- Raconte-moi une blague / ...
- Fais le canard / Quel bruit fait la vache ? / ...
- Météo de demain à Dijon / Quel temps fera-t-il aujourd'hui à Dijon ?

## Usage

You can easily modify this project in order to add new commands/features, change the langage, ...

The entry point is `index.js`, making the link between the hotword, the STT, the meaning detector, the response handler and the TTS.

### Hotword

The hotword engine uses Python and Porcupine in order to detect the "OK Ada". Python is required because the Node.js Porcupine module does not run on Windows.

### STT:

The STT uses [Wit.ai](https://wit.ai/) to convert the recorded sound to text.

File: `stt.js`

### Meaning detector:

This file parse the content from the STT to extract commands and parameters.

File: `meaning.js`

### Response handler:

This file manage the parsed content returned from the meaning detector. It makes calls to the API folder in which are stored the core of the APIs and it calls the TTS to respond.

File: `responses.js`

### TTS:

The TTS uses my API to generate wav from the text, using libttspico-utils with a Node.js server ([see more here](https://github.com/gauthier-th/node-ttspico-server)). There is a ratelimit of 1 call per 4 seconds, with a max of 500 characters. This would normally not be restrictive for a normal usage, but you can set up your own server or use another librairy if you want.

File: `tts.js`

### TODO:

- Add multilanguage (i18n)
- Auto installer (for Python, SoX, Node.js, packages, ...)

## Contribution

If you have any problem using this project, feel free to open an issue.

PR are welcome!

## License

MIT License

Copyright (c) 2020 Gauthier THOMAS