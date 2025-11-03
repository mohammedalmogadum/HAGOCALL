#!/usr/bin/env bash
# gradlew wrapper script
DIR=$(cd "$(dirname "$0")"; pwd)
"$DIR/gradle/wrapper/gradle-wrapper.jar" "$@"
