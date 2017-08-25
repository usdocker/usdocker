# Troubleshoting

## I am installing a script and I am getting an error

Try:

```bash
npm i -g --ignore-scripts <yourscript> usdocker
usdocker -r
``` 

## Error: connect ENOENT /var/run/docker.sock

1. Is Docker installed locally?
2. Are you running on Windows or Mac? (See [windows](windows.md) or [mac](mac.md))

Try to setting the docker connections properly:

```bash
usdocker --global docker-host=http://localhost:2375
```

