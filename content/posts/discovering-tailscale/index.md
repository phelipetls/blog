---
title: "Discovering Tailscale"
date: 2022-05-17
tags: ["tailscale", "web", "hugo", "android"]
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

```shell-sesson
$ curl -fsSL https://tailscale.com/install.sh | sh
```

This will install a command-line interface, which is the primary way you'll use
it in Linux.

## Usage

You just need to run one command to start Tailscale and authenticate:

```shell-sesson
$ tailscale up
```

To check your connected devices and their IP addresses, 

```shell-sesson
$ tailscale status
100.x.y.z   fedora               phelipetls@  linux   -
```

Now try downloading the mobile app and activate it there, and your mobile
device should be listed in there as well:

```shell-sesson
$ tailscale status
100.x.y.z   fedora               phelipetls@  linux   -
100.x.y.z   s20-fe-de-phelipe    phelipetls@  android idle, tx 6685800 rx 260204
```

# Use cases

What initially made me reach to Tailscale was that I wanted to run my blog in
my mobile device, because I needed to test if previewing PDF with
[`pdf.js`](https://mozilla.github.io/pdf.js/) was working.

Initially, I went with what I was familiar to me, which is using
[`adb`](/posts/adb-a-must-know-cli-tool-for-android-development/). But the
[initial setup
required](https://developer.android.com/studio/command-line/adb#connect-to-a-device-over-wi-fi-android-11+)
is non-trivial, and you'd have to install `adb`. It's still a good option
though, if the initial setup has already been done.

Anyway, this made me suspicious that there's gotta be an easier way to do this.
I got a hint that Tailscale might help with that, so I went to read about it.

## Testing Hugo website in a mobile device

Having done the initial setup, [it took me some
help](https://www.reddit.com/r/Tailscale/comments/ukittc/how_to_access_a_web_server_running_on_my_laptop/)
to find out how to make Hugo's development server, running in my laptop,
available to my mobile device. Eventually I found this does the trick:

```shell-sesson
$ hugo serve --bind 100.x.y.z --baseUrl 100.x.y.z
```

Where `100.x.y.z` is the laptop's Tailscale IP address, i.e. the output of
`tailscale ip -4`. Now just open the URL `http://100.x.y.z:1313` on your mobile
device. In fact, you don't even need to be on the same Wi-Fi for this to work,
it's going to be available as long you're still connected to Tailscale. That's
the magic thing about it.

## Test any server in a mobile device

Of course, this is not limited to Hugo. Many web servers provide a way to do
the same. Say, for example, you want to serve the static build of your site, in
the `public` directory and check it out in your phone.

You can use Python's `http.server` module:

```shell-sesson
$ python3 -m http.server --bind $(tailscale ip -4) --directory public
```

Or Vercel's [`serve`](https://github.com/vercel/serve):

```shell-sesson
$ npx serve --listen $(tailscale ip -4) public
```

Usually, one of these two command-line options, `--bind` or `--listen`, will be
available.

## Taildrop

Tailscale also has a feature called
[Taildrop](https://tailscale.com/kb/1106/taildrop/), a convenient way to share
files between devices.

In your Android device, Tailscale will show up as an option to share files, and
in doing so you'll be able to get the file into the current directory of your
laptop with `sudo tailscale file get .`.

Alternatively, you can send files from your laptop to your mobile device with:

```shell-sesson
$ sudo tailscale file cp $file $mobile_device_tailscale_ip_address:
```
