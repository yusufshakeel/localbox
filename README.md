# localbox

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yusufshakeel/localbox)
![Static Badge](https://img.shields.io/badge/version-v0.3.13-blue)

Turn your laptop or desktop into a personal local cloud to easily share files with 
other devices on the same Wi-Fi network.

![image](public/assets/img-v0.3.10.png)

## Table of Content

* [Use Case](#use-case)
* [Server Clients](#server-clients)
* [Minimum Requirements](#minimum-requirements)
* [Getting Started](#server-clients)
* [Get Updates](#get-updates)
* [Configurations](#configurations)
* [Folders](#folders)
* [License](#license)
* [Donate](#donate)

## Use Case

Imagine you’re at home or in an office:

* You can quickly share files like photos, documents, or videos between your phone and computer without using cloud services (e.g., Google Drive or Dropbox).
* Any device on the same Wi-Fi network can interact with the Local Box to upload files or retrieve hosted files.

## Server Clients

The computer that is running this application will act like the server. A local IP address (like 192.168.0.151)
will be displayed. Clients (other users) can connect to that IP address via browsers.

Make sure to add port number to the url.

If the server IP is 192.168.0.151 and is running at port 3001 then type `http://192.168.0.151:3001` in the browser.

![image](public/assets/server-clients.png)

## Minimum requirements

* Node.js (version 16 or higher)
* Any modern laptop or desktop should work.
  * I am using HP ProBook 6450b laptop from the year 2010.
  * Specs:
    * 320GB HDD
    * 4GB RAM
    * Ubuntu 20.04LTS.

## Getting Started

Clone this repository

```shell
git clone https://github.com/yusufshakeel/localbox.git
```

Install dependencies

```shell
npm i
```

Bootstrap

```shell
npm run bootstrap
```

Run the local server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser to see the result.

## Get Updates

Just pull the latest **main** branch.

```shell
git pull origin main
```

## Configurations

You will find configurations inside `src/configs` folder.

### TempChats

File: `src/configs/temp-chats.ts`

## Folders

### public

This directory contains files and folders that can be viewed in browser
when you are running localbox.

### public/assets

This directory contains assets of the project. Don't change anything here.

### public/audios

You can upload audio files in this folder and clients will be able to download them.

### public/documents

You can upload document files in this folder and clients will be able to download them.

### public/images

You can upload image files in this folder and clients will be able to download them.

### public/uploads

Any client can upload any files here.

### public/videos

You can upload video files in this folder and clients will be able to download them.

## License

It's free :smiley:

[MIT License](https://github.com/yusufshakeel/localbox/blob/main/LICENSE) Copyright (c) 2024 Yusuf Shakeel

## Donate

Feeling generous :smiley: [Donate via PayPal](https://www.paypal.me/yusufshakeel)