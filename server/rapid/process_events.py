import argparse
import pandas as pd
import pathlib

# from sqlalchemy import create_engine

def process_events(input_csv, outpath, nozip=False):
    columns = ["service_date", "route_id", "trip_id", "direction_id", "stop_id", "stop_sequence",
               "vehicle_id", "vehicle_label", "event_type", "event_time_sec"]

    df = pd.read_csv(input_csv, usecols=columns,
                     parse_dates=["service_date"],
                     infer_datetime_format=True,
                     dtype={
                         "route_id": "str",
                         "trip_id": "str",
                         "stop_id": "str",
                         "vehicle_id": "str",
                         "vehicle_label": "str",
                         "event_time": "int"})

    df["event_time"] = df["service_date"] + pd.to_timedelta(df["event_time_sec"], unit="s")
    df.drop(columns=["event_time_sec"], inplace=True)

    # Handle Union Sq GL
    df.stop_id.replace({
        "Union Square-01": "70503",
        "Union Square-02": "70504"
    }, inplace=True)
    
    # Handle Brattle loop at govt center (yes, this is its gtfs stop id).
    if "Government Center-Brattle" in df.stop_id.values:
        print("ignoring the following data points:")
        print(df[df.stop_id == "Government Center-Brattle"])
    df = df[df.stop_id != "Government Center-Brattle"]

    # engine = create_engine('postgresql+psycopg2://ajp1:tubbs@localhost:5432/tm')
    # df.to_sql('rapid_events', engine, schema='tm_mbta_performance', if_exists='append', index=False)
    
    df.to_csv(outpath, index=False)

    """
    service_date_month = pd.Grouper(key="service_date", freq="1M")
    grouped = df.groupby([service_date_month, "stop_id"])

    for name, events in grouped:
        service_date, stop_id = name

        fname = pathlib.Path(outdir,
                             "Events",
                             "monthly-data",
                             str(stop_id),
                             f"Year={service_date.year}",
                             f"Month={service_date.month}",
                             "events.csv.gz")
        fname.parent.mkdir(parents=True, exist_ok=True)
        # set mtime to 0 in gzip header for determinism (so we can re-gen old routes, and rsync to s3 will ignore)
        events.to_csv(fname, index=False, compression={"method": "gzip", "mtime": 0} if not nozip else None)
    """

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("input", metavar="INPUT_CSV")
    parser.add_argument("--output", "-o", metavar="OUTPUT_DIR", default="data/processed/", required=False)

    parser.add_argument("--nozip", "-nz", action="store_true", help="debug feature to skip gzipping")

    args = parser.parse_args()
    input_csv = args.input
    output_dir = args.output
    no_zip = args.nozip

    outdir = pathlib.Path(output_dir)
    outdir.mkdir(exist_ok=True)

    outpath = (outdir / pathlib.Path(input_csv).stem).with_suffix(".processed.csv")

    process_events(input_csv, outpath, no_zip)


if __name__ == '__main__':
    main()
