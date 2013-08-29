
RESOURCE=~/works/ace/src/main/webapp/WEB-INF/resources

TARGET=$RESOURCE/scripts/sea-modules/kj/grid/1.4.0
mkdir -p $TARGET
cp dist/* $TARGET
cp package.json $TARGET

cp demo/styles/main.css $RESOURCE/styles/grid.css
