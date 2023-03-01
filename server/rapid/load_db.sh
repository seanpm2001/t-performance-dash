#!/bin/bash

for f in $(find data/processed -name *.csv | sort -V); do
echo $f
psql \
   --host=tm-pginst1.ciobb18io9qn.us-east-1.rds.amazonaws.com \
   --port=5432 \
   --username=ajp1 \
   --dbname=mbta \
   <<EOF
\set ON_ERROR_STOP
\copy dashboard.rapid_events (service_date, route_id, trip_id, direction_id, stop_id, stop_sequence, vehicle_id, vehicle_label, event_type, event_time) FROM '$f' delimiter ',' csv header
EOF
if [ $? -eq 0 ]; then
    mv $f data/done/
else 
    echo "error with file $f"
    exit 1
fi
done
