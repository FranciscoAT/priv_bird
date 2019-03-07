#!/bin/bash
session="priv_bird"
tmux new-session -s ${session} -d
tmux send -t ${session} "cd sample-site; npm install; sleep 5s; npm run start" ENTER
tmux split-window -h
tmux send -t ${session} "cd extension; npm install; gulp watch" ENTER
tmux split-window -v
tmux send -t ${session} "cd remote-site; npm install; npm run start-dev" ENTER
tmux -2 attach-session -d
