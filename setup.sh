#!/bin/bash
session="priv_bird"
tmux new-session -s ${session} -d
tmux send -t ${session} "cd sample-site; npm start" ENTER
tmux split-window -h
tmux send -t ${session} "cd extension; gulp watch" ENTER
tmux -2 attach-session -d
