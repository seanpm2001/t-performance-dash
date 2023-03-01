import psycopg2
import psycopg2.extras
from psycopg2 import sql

import boto3
import os

import tempfile

ENDPOINT = "tm-pginst1.ciobb18io9qn.us-east-1.rds.amazonaws.com"
PORT = "5432"
USER = os.environ["RDS_DBUSER"]
REGION = "us-east-1"
DBNAME = "mbta"
SSLCERTIFICATE = "./us-east-1-bundle.pem"
if os.environ["TM_FRONTEND_HOST"] == 'localhost':
    SSLCERTIFICATE = "./vendor/us-east-1-bundle.pem"

session = boto3.Session()
client = session.client('rds')

token = client.generate_db_auth_token(
    DBHostname=ENDPOINT,
    Port=PORT,
    DBUsername=USER,
    Region=REGION
)

def get_db_conn():
    # CURRENT ISSUE:
    # awslambda-psycopg2 doesn't have ssl by default
    # need an updated version for this to work
    conn = psycopg2.connect(
        host=ENDPOINT,
        port=PORT,
        dbname=DBNAME,
        user=USER,
        password=token,
        connect_timeout=5,
        sslmode='verify-full',
        sslrootcert=SSLCERTIFICATE
    )
    return conn

def download_events(sdate, edate, stops, bus=False):
    conn = get_db_conn()
    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    table = "rapid_events" if not bus else "bus_events"
    cur.execute(sql.SQL("""
        SELECT * from {table} WHERE 
        stop_id IN %s AND
        service_date BETWEEN %s and %s
        ORDER BY event_time;
        """).format(table=sql.Identifier("dashboard", table)),
        (tuple(stops), sdate, edate))
    return cur.fetchall()
