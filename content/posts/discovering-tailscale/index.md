---
title: "Discovering Tailscale"
date: 2022-05-14
tags: ["tailscale", "web", "hugo", "android"]
draft: true
---

I have recently started playing with Tailscale, and after a rough start I think
I got the hang of it and wanna share how it improved some of my workflows like
testing my blog on my Android device or connecting to it with `adb` without a
USB cable.

# What is Tailscale?

Tailscale helps you connect your devices seamlessly, without configuration or
much setup, in a virtual private network. All you need is to download the app
on your operating system, log in and enjoy. A stable IP address, in the range
`100.x.y.z`, will be assigned to your devices, meaning it [won't
change](https://tailscale.com/kb/1033/ip-and-dns-addresses/), which
is convenient.

## Download

[You can download Tailscale here](https://tailscale.com/download/). A shell
script is provided for Linux:

```sh
% curl -fsSL https://tailscale.com/install.sh | sh
```

This will install a command-line interface, which is the primary way you'll use
it in Linux.

## Usage

You just need to run one command to start Tailscale and authenticate:

```sh
% tailscale up
```

To check your connected devices and their IP addresses, 

```sh
% tailscale status
100.x.y.z   fedora               phelipetls@  linux   -
```

Now try downloading the mobile app and activate it there, and your mobile
device should be listed in there as well:

```sh
% tailscale status
100.x.y.z   fedora               phelipetls@  linux   -
100.x.y.z   s20-fe-de-phelipe    phelipetls@  android idle, tx 6685800 rx 260204
```

# Use cases

What initially made me reach to Tailscale was that I wanted to run my blog in
my mobile device, mainly because I needed to test if previewing my
[resumé](/resume) with [`pdf.js`](https://mozilla.github.io/pdf.js/) worked,
since PDF preview is not built into mobile browsers.

Initially, I went with what I was familiar to me, which is using
[`adb`](/posts/adb-a-must-know-cli-tool-for-android-development/). But the
initial setup required was huge and demotivating, just look at the [steps
needed to connect via
Wi-Fi](https://developer.android.com/studio/command-line/adb#connect-to-a-device-over-wi-fi-android-11+),
it includes installing Android Studio, the Android SDK, among other things for
such a seemingly simple thing.

This made me suspicious there's gotta be an easier way to do this. I got a hint
that Tailscale might help with that, so I went to read about it.

## Testing Hugo website in a mobile device

Having done the initial setup, it took me some time to find how to make the web
development server running Hugo on my laptop available on my phone. Eventually
I found that this works:

```sh
hugo serve --bind 100.x.y.z --baseUrl 100.x.y.z
```

Where `100.x.y.z` is the laptop's Tailscale IP address, i.e. the output of
`tailscale ip -4`. Now just open the URL `http://100.x.y.z:1313` on your mobile
device.

## Test any website in a mobile device

Of course, the same can be achieved with many web servers. Say, for example,
you want to serve the static build. You can do the same with Python's
http.server module:

```sh
% python3 -m http.server --bind $(tailscale ip -4) --directory .
```

Or [`serve`](https://www.npmjs.com/package/vercel):

```sh
% npx serve --listen %(tailscale ip -4) public
```

It usually is one of these two command-line options, `--bind` or `--listen`.

# Taildrop

Another convenient feature is what they called
[Taildrop](https://tailscale.com/kb/1106/taildrop/), which is just a way to
share files between devices.

For example, in your Android emulator you can choose Tailscale after clicking
on the Share button, and you'll be able to get these file into the current
directory of your laptop with `sudo tailscale file get .`.

Alternatively, you can sendo files from your laptop to your mobile device with

```sh
% sudo tailscale file cp $file $mobile_device_tailscale_ip_address:
```

And you'll be notified about the received file.
