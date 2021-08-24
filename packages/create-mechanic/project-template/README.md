# Mechanic project

If you haven't already, move your working directory to this project to run Mechanic commands:

```
cd path/to/project
```

## Running design functions

To run and see your design functions in action right away, just call:

```
npm run dev
```

This will bundle and serve in place a web app that you can open and interact with in your own browser. That way you can test out the code of you design functions, start prototyping assets and exporting them.

Alternatively, you can first built the app, which will generate a folder with the code transformed:

```
npm run build
```

And to serve that already built app and interact with it in a browser, run:

```
npm run serve
```

## Adding new design functions

There's two ways of doing it. First, running a command that will ask you a couple of questions to create a new design functions from a base (template, example or blank):

```
npm run new
```

The other way is to do it manually. Add a new folder in your design functions directory, and add there a `index.js` file. There you should define all necessary exports of a design function. Also, you should add all dependencies that your new design function would use, including its engine. Note that all these steps is done by the previous command.

## More Mechanic

To learn about what can be done and how to do it through Mechanic, visit the [documentation site](https://mechanic.design/docs).
