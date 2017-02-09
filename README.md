# Tally
[![Build Status](https://travis-ci.com/beheh/tally.svg?token=DyeK73JepzhYTQHiANnx&branch=master)](https://travis-ci.com/beheh/tally)

Tally is a lightweight HSReplay.net client.

It automatically fetches an API token from [HSReplay.net](https://hsreplay.net/) which it
uses to upload replays. The token can be linked to an account at any time, making the
replays appear on HSReplay.net under "My Replays".

## Requirements
- `npm install yarn --global`
- `yarn install`

## Development
- `node_modules/.bin/tsc --watch`
- `node_modules/.bin/electron .`
