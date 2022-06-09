version=$(cat version.txt)
echo "version = $version"

if [ -z ${var+x} ]; then
    BRANCH=$1
    echo "branch = $BRANCH"
else
    echo "Please pass the branchname as an argument to the script"
    exit 1
fi

export DOCKER_BUILDKIT=1
docker buildx build . -f docker/images/n8n-custom/Dockerfile --build-arg BUILDKIT_INLINE_CACHE=1 -t registry.digitalocean.com/cloudintegration/n8n:$BRANCH-$version

echo "docker push registry.digitalocean.com/cloudintegration/n8n:$BRANCH-$version"

echo "push done - please update the docker version via the api endpoint to match $BRANCH-$version"



