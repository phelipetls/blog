---
title: 'adb: a must-know CLI tool for Android development'
date: 2022-02-07
tags: ['react native', 'android', 'mobile']
---

[`adb`](https://developer.android.com/studio/command-line/adb) is a CLI that
lets you control your Android device from your computer. In this post I want to
share its features that made me enjoy more mobile development.

<!-- more -->

# Initial Setup

First, you'll need to connect your device to your computer, either [through
USB](https://developer.android.com/studio/command-line/adb#Enabling) or [purely
via
Wi-Fi](https://developer.android.com/studio/command-line/adb#connect-to-a-device-over-wi-fi-android-11+)
(*if you're on Android 11+*), but it's also possible to use `adb` over Wi-Fi on
Android 10 or lower if you follow some [initial
steps](https://developer.android.com/studio/command-line/adb#wireless) while
connected over USB.

If everything works correctly, by running `adb devices` you should see
something like this:

```sh
$ adb devices

List of devices attached
emulator-5554	device
0035714150	device
```

# Record screen with `adb shell screenrecord`

It's as simple as running `adb shell screenrecord /sdcard/video.mp4` to start
recording and then <kbd>Ctrl</kbd> + <kbd>C</kbd> when you're done. And then
`adb pull /sdcard/video.mp4 ~/Videos/video.mp4` to get it into your computer.

This is invaluable to me. I'm now able to more easily record how a feature
works or to demonstrate a bug.

It's also useful to know some of the [command line
options](https://developer.android.com/studio/command-line/adb#screenrecord),
my favorite ones being to limit the video size `--size` and limit recording
time `--time-limit`.

I usually run `adb shell screenrecord --size 320x568 --time-limit=120
/sdcard/video.mp4`, to keep the video small.

# Capture screen with `adb shell screencap`

This is straightforward, just capture the screen with `adb shell screencap
/sdcard/img.png`, then getit locally with `adb pull /sdcard/img.png
~/Images/img.png`.

# Debugging with `adb logcat`

This has proved useful to me so many times. In the context of React Native
development, this is usually less useful during development on debug builds.
But in release builds it's the only way to debug when something wrong happens.

For example, when an app crashes or some SDK call is not working, you'll
probably be able to see why with `adb logcat`.

The downside is that the output can be overwhelming, since it's usually a wall
of text that is growing constantly. So it's useful to know how you can filter
this
output.

For example, if I wanted to see only logs tagged with `Sentry`, `ReactNative`
and `ReactNativeJS` at any priority:

```sh
adb logcat Sentry:* ReactNative:* ReactNativeJS:* *:S
```

The official Google
[documentation](https://developer.android.com/studio/command-line/logcat#filteringOutput)
explains nicely how this works.

# Networking with `adb reverse`

This one is best explained through an example.

Image you want to see your [Storybook](https://storybook.js.org/) files in a
mobile web browser. In your computer's browser, it works if you go to
`localhost:6006` but not in your mobile device's browser.

Well, you can solve this with `adb reverse tcp:6006 tcp:6006`.

This is useful for any web server running in your local computer, e.g., a web
API server or a webpack development server.

In the React Native world, we sometimes need to run `adb reverse tcp:8081
tcp:8081` it the device is stuck at loading the JS bundle or can't find it at
all. If you run this once without knowing what it does, now you know. It's
routing a your mobile device's request to `localhost:8081` to your computer's
`localhost`.

There's also `adb forward`, which is the opposite of `adb reverse`, so it's
hardly as useful.

# Start/kill app

You can start and kill an app with the `adb shell am`, in which `am` stands for
[*Activity Manager*](https://developer.android.com/studio/command-line/adb#am).

Given the app's package name, you can start it with:

```sh
adb shell am start -n com.company.app/.MainActivity
```

And kill it with:

```sh
adb shell am force-stop com.company.app
```

You can also open a URL, this is specially useful to test deep links:

```sh
adb shell am start -a android.intent.action.VIEW -d company://Screen
```

# Install and uninstall apps

You can install an `.apk` file with `adb install app.apk`.

And uninstall it with `adb uninstall com.company.app`.

This is usually how I do it, but there's also the `pm` command, which stands
for [Package
Manager](https://developer.android.com/studio/command-line/adb#pm), that is a
more powerful interface to manage apps. Apart from enabling you to install and
uninstall apps, you can also clear data, grant/revoke permissions etc.
