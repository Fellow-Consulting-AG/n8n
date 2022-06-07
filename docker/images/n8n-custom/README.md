# n8n - Custom Image

Dockerfile which allows to package up the local n8n code into
a docker image.


## Usage

Execute the following in the n8n root folder:
```bash
docker build -f docker/images/n8n-custom/Dockerfile . -t registry.digitalocean.com/cloudintegration/n8n:sandbox-quickfix
```
