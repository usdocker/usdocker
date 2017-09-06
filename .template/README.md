# Useful script for '__SERVICE__' service

This Useful Script creates a __SERVICE__ server based on a Docker Image.
You don't have know docker to use this solution.

## Installing

```bash
npm install -g @usdocker/usdocker  # Install it first
npm install -g usdocker-__SERVICE__
```

## Start the __SERVICE__ service

```bash
usdocker __SERVICE__ up
```

## Stop the __SERVICE__ service

```bash
usdocker __SERVICE__ down
```

## Check the __SERVICE__ status

```bash
usdocker __SERVICE__ status
```


## Customize your service

You can setup the variables by using:

```bash
usdocker __SERVICE__ --set variable=value
```

Default values

 - image: "__SERVICE__",
 - folder: "$HOME/.usdocker/data/__SERVICE__",
 - port: 0

