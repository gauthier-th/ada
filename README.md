# Ada AI

Works on Windows 10 x64.

## Requirements

- python 3.6
- SoX 14.4.1

## Installation

You need to install the Python packages in the `hotwords/` directory (see `hotwords/requirements.txt`)
You need to install the Node.js packages in the root directory with `npm install`

## Configuration

Create a `.env` file in the root directory according to `.env.example`.
- `API_KEY`: your Wit.ai API key
- `SILENCES_COUNT`: silence count before end of listening
- `SPOTIFY_CLIENT_ID`: your Spotify client ID
- `SPOTIFY_CLIENT_SECRET`: your Spotify client secret
- `WEB_SERVER_PORT`: local web server IP (e.g. `8080`)
- `ROOT_URL`: root web server URL (e.g. `http://localhost:8080/`)
- `OPENWEATHERMAP`: your OpenWeatherMap API key ([see here](https://openweathermap.org/))

You can also customize the configs/apps.js file where are stored the available applications.