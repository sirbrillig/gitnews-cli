# gitnews

A simple CLI tool to see your GitHub notifications.

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
