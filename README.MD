<img src="./docs/logo.png" height="128" />

# Archived 
This open-source version of the extension is no longer supported. You can install the proprietary version from https://typebar.app

# tweetGPT Chrome Extension - Community Edition
This is an open-source edition of the [TweetGPT chrome extension](https://chrome.google.com/webstore/detail/tweetgpt/lkjblpoingopdeaofcaapmeoojjjnhnc). It doesn't use TweetGPT backend and only relies on your own OpenAI API credentials.

## Requirements
To use this extension, will you need:
* Twitter account
* OpenAI [API KEY](https://platform.openai.com/account/api-keys)
* Chrome browser

## Installation
1. Clone this repo to your machine
2. Open [chrome://extensions/](chrome://extensions/) in your browser
3. Check the box for Developer mode in the top right
4. Press __Load Unpacked__ button and select the folder with the code
5. The settings screen should open, where you need to put your OpenAI API Key. You can find your API key on [this page](https://platform.openai.com/account/api-keys).

You can start using the extension now.


## How to use tweetGPT
When you open a new tab with Twitter, you will see this icon under the tweet section:

<img src="./docs/screenshot.png" height="120">

When you press it, it will let you select a type of tweet to generate. The types include positive, negative, controversial, etc. 

<img src="./docs/options.png" height="300">

Once selected, the extension will write a new tweet.

For a reply, it will generate a tweet based on the original tweet. For a new tweet, it will ask for a topic you want to write tweet about.

<img src="./docs/reply.gif" height="379" width="609">

## ⚠️ Warning
Depending on the tweet type, TweetGPT can sometimes generate controversial or even offensive tweets.
Remember, this is like an L2 autopilot - the driver is responsible for the outcome. Don't tweet what you disagree with, just re-generate the tweet instead.
