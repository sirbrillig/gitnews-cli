# gitnews-cli

A simple CLI tool to see your GitHub notifications.

# Install

Via npm:

```
$ npm i -g gitnews-cli
```

# Usage

You will need a GitHub token. To create the token, visit the [Tokens](https://github.com/settings/tokens) page and generate a new token for the app. You can call it "gitnews" and it needs at least `notifications` and `repo` scopes.

Once the token is created, just run:

```
$ gitnews --save-token
```

After the token is saved, you can run:

```
$ gitnews
```

to fetch and display your notifications.

If you want to see messages you've already read, you can pass the `--read` option:

```
$ gitnews --read
```

# Related

Built using [gitnews](https://github.com/sirbrillig/gitnews) to fetch the notifications. If you want a similar app for your menubar, check out [gitnews-menubar](https://github.com/sirbrillig/gitnews-menubar).
