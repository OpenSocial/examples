from bottle import route, get, post, request, run, abort, static_file
import sqlite3
import json
import uuid
import datetime

@route('/<filename:path>')
def send_static(filename):
    return static_file(filename, root='/home/bob/code/examples/gadgets/activitystream/')

run(host='0.0.0.0', port=8083, server='paste')
