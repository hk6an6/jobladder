#!/bin/bash
pg_dump -Fc -U postgres -W -h localhost jobladder > db.dump

