#!/bin/bash
pushd .
rm -f DrSpeech.zip
cd src
zip ../DrSpeech.zip ./index.js ./AlexaSkill.js ./node_modules/* ./lib/*
popd