# Tally

Tally is a light-weight HSReplay.net client for uploading replays.

It automatically fetches an API token from HSReplay.net which it uses to upload replays.
The token can be linked to an account at any time, making the replays appear on
HSReplay.net under "My Replays".

## Compiling

- `npm i -g webpack typings`
- `npm i`
- `typings i`
- `webpack`

## Running

- `node_modules/.bin/electron .`
