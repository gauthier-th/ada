# Ada AI

Works on Windows 10 x64.

## Requirements

- python 3.6
- SoX

## Installation

You need to install the Python packages in the `hotwords/` directory (see `hotwords/requirements.txt`)
You need to install the Node.js packages in the root directory with `npm install`

## Configuration

Create a `.env` file in the root directory according to `.env.example`.
- `API_KEY`: your Wit.ai API key
- `SILENCES_COUNT`: silence count before end of listening