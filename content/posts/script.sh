#!/bin/bash

for dir in */; do
  cd $dir
  while read -r line; do
    filename=${line#images/}
    filepath="/home/phelipe/Documentos/phelipetls.github.io/images/$filename"
    cp $filepath .
  done < <(grep -Eo 'images/([^)]+)' index.md)
  cd ..
done
