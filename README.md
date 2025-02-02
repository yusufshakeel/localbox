# localbox

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yusufshakeel/localbox)
![Static Badge](https://img.shields.io/badge/version-v0.11.0-blue)

Turn your laptop or desktop into a personal local cloud to easily share files with 
other devices on the same Wi-Fi network.

Features:
* Personal Drive with configurable storage limit per user
* File upload and sharing
* Temporary Chats (TempChats)
* Audio/Video player
* User management (Authentication and Authorization)
* Dark Mode

Key building blocks:
* Framework: [Next.js](https://github.com/vercel/next.js)
* UI: [shadcn-ui](https://github.com/shadcn-ui/ui)
* Audio/Video: [video.js](https://github.com/videojs/video.js)
* Authentication and Authorization: [next-auth](https://github.com/nextauthjs/next-auth)
* Database: [minivium](https://github.com/yusufshakeel/minivium)

### Home

![img-v0.9.1.png](public/assets/img-v0.9.1.png)

### Personal Drive

![personal-drive.png](public/assets/personal-drive.png)

### Admin Dashboard

![admin-dashboard-v0.11.0.png](public/assets/admin-dashboard-v0.11.0.png)

## Table of Content

* [Use Case](#use-case)
* [Server Clients](#server-clients)
* [Minimum Requirements](#minimum-requirements)
* [Getting Started](#getting-started)
* [First time setup](#first-time-setup)
* [Rerun setup](#rerun-setup)
* [Reset Admin Password](#reset-admin-password)
* [Get Updates](#get-updates)
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

## Minimum requirements

Software:
* Node.js (version 16 or higher)
* npm
* npx

Hardware:
* Any modern/older laptop or desktop should work.

My setup:
* Laptop: HP ProBook 6450b
* Year: 2010
* Storage: 320GB HDD
* Memory: 4GB
* OS: Ubuntu 20.04LTS

## Getting Started

### Clone

* Clone this repository from [GitHub](https://github.com/yusufshakeel/localbox).

```shell
git clone https://github.com/yusufshakeel/localbox.git
```

### Install dependencies

* Go inside the cloned directory and install the dependencies

```shell
npm i
```

### Bootstrap

* Now, run the following command in the terminal to bootstrap the project.

This will create files and folders that are needed by the application.

```shell
npm run bootstrap
```

### Build

* Now, build the application by running the following command in the terminal.

This will build the application.

```bash
npm run build
```

### Start the server

* You are now ready to start your localbox server.

```bash
npm run start
```

>
> Alternatively, run the following command if you want to run the application in dev mode.
>
> ```shell
> npm run dev
> ```
>

* You will see the url of the localbox application in the terminal after it starts running.

* Open the url (example [http://localhost:3000](http://localhost:3000)) in the browser.

## Use port

Run the following command to run the application on another port.

```shell
PORT=9000 npm run start
```

## First time setup

* Go to Home page, and you will see localbox perform some setup operations.
* You will also get the **admin** account created.
* A `setup.lock` file will be created inside the `/private` folder.

Default credentials
```text
Username: admin
Password: root1234
```
Change the password of the **admin** account after logging in.

**Important! Make sure to restart the server.**

## Rerun setup

* Delete the `setup.lock` file from the `/private` folder.
* Run the server `npm run start` or `npm run dev`
* Open the Home page.
* Setup will be performed again.
* **Important! Make sure to restart the server.**

### When to rerun the setup?

- When pulling the latest code from the main branch from [GitHub](https://github.com/yusufshakeel/localbox).
- When you re-install the npm packages by running the `npm i` command.
- When you re-bootstrap.

## Reset Admin Password

Go to `/private` folder and look for `reset-admin-password.txt` file. Enter the new password like
the following and save the file.

```text
NEW_PASSWORD=myNewAdminPassword
```
Points to note:
- Make sure to write the password after the `=` sign.
- Do not add space before/after the password.
- Keep the password within one line.
- Password length must be more at least 8 characters and less than
32 characters.

Now, go to the home page and the admin password will be updated.

## Get Updates

Pull the latest **main** branch changes to your local **main** branch.

```shell
git pull origin main
```

If you are pulling a newer version then run the [install dependencies](#install-dependencies), 
[bootstrap](#bootstrap), [build](#build) and the 
[rerun setup](#rerun-setup) steps again.

## Folders

### private

This directory contains private files. Don't change anything here.

### public

This directory contains files and folders that can be viewed in browser
when you are running localbox.

## License

It's free :smiley:

[MIT License](https://github.com/yusufshakeel/localbox/blob/main/LICENSE) Copyright (c) 2024 Yusuf Shakeel

## Donate

Feeling generous :smiley: [Donate via PayPal](https://www.paypal.me/yusufshakeel)