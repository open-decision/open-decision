# Open Decision

Open Decision is a free and Open Source no-code platform to automate workflows and responses to recurring requests. Designed for the legal market.

Further information and a live version of the Software → [open-decision.org](https://open-decision.org)

Join our community → [Slack Workspace](https://open-decision.org/slack)

## Table of Contents

- [Setup](#setup)
- [License](#license)

## Setup

Make sure to have the following installed:

- node.js
- git
- docker

Run the following commands in terminal to start open-decision:

1. Git clone `https://github.com/open-decision/open-decision.git`
2. Install dependencies with `yarn install`
3. Then run `yarn setup` to generate the prisma client
4. Now start the development server with `yarn nx serve:app builder`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
