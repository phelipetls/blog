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

## Debugging Hugo website in a mobile device

Something wasn't right with my code though, since the PDF was not being drawn
on the mobile device only. So I needed some way to to discover the exact error
that happened.

Fortunately, it's possible to do remote debugging with both Firefox and Chrome.
This is usually achievable by making your device discoverable to
[Firefox](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html)
and [Chrome](https://developer.chrome.com/docs/devtools/remote-debugging/)
with an USB cable, but how can we remove the need for an USB?

Since Android 11, [it's possible to connect to an Android device in the same
Wi-Fi](https://remysharp.com/2016/12/17/chrome-remote-debugging-over-wifi).
Apart from the usual setup, you'll also need to enable Wi-Fi debugging, grab
the mobile device IP address and run

```sh
adb connect $MOBILE_DEVICE_IP_ADDRESS:5555
```

### Chrome

If everything was [set
up](https://developer.chrome.com/docs/devtools/remote-debugging/#discover)
correctly, you'll be able to see your device listed when you open
`chrome:inspect`:

{{< figure src="./chrome-remote-debugging.png" alt="Remote debugging an Android device with Chrome" >}}

Click the Inspect next to the tab you want to debug.

{{< note >}}
The opened browser tabs will only show up while the Chrome app is being used
though, so this can be confusing.
{{< /note >}}

### Firefox

Firefox requires a bit more of extra setup, like enabling [remote debugging in
its
settings](https://firefox-source-docs.mozilla.org/devtools-user/remote_debugging/firefox_for_android/index.html#enable-remote-debugging).

But then, upon opening `about:debugging` you should see your mobile device
listed on the side, be able to connect to it, and start inspecting some tabs.

{{< figure src="./firefox-remote-debugging.png" alt="Remote debugging an Android device with Firefox" >}}

{{< note >}}
You'll notice I blurred my Tailscale IP addresses. I'm pretty sure this is not
needed, it's not like this is exposed to everyone, I would have to deliberately
enable access to someone for this. But, just to be extra safe...
{{< /note >}}

# Conclusion

And that's how Tailscale helped me found out that minifying the `pdf.js`
service worker file with esbuild was causing it not to render my resumé, for
some odd reason. So for the mean time I'll just let people download a huge
amount of JavaScript instead, sorry.

I recognize this might seem a pretty obvious use case, not very impressive. But
it is a non-trivial improvement to my workflow, so I'm hoping it will be for
someone else out there too.
