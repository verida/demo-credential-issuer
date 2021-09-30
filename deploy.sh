# To use this you will need to set an named AWS profile.
# Docs are at https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
#
# Something like this works 
#   export AWS_PROFILE=verida-prod
#

if [[ -z "$AWS_PROFILE" ]]; then
    echo "You need to set AWS_PROFILE to use this script" 1>&2
    exit 1
fi

npm run build

echo "Deploying now"

# This copys from the build directory to S3
aws s3 sync dist s3://mapay.demos.testnet.verida.io --delete

# And now we invalidate the cached cloudfront distribution so changes are available
aws cloudfront create-invalidation --distribution-id E1I0M2DR08H7IP  --paths "/*"