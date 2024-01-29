import requests
from datetime import date, timedelta

lines = ["Red", "Orange", "Blue", "Green-B", "Green-C", "Green-D", "Green-E"]

start_dt = date(2024, 1, 1)
end_dt = date.today()

# difference between current and previous date
delta = timedelta(days=1)

# store the dates between two dates in a list
dates = []


while start_dt <= end_dt:
    # add current date to list by converting  it to iso format
    dates.append(start_dt.isoformat())
    # increment start date by timedelta
    start_dt += delta

for line in lines:
    disabled_trains = []
    police_activity = []
    medical_emergency = []
    fire = []
    flooding = []
    signal_problem = []
    door_problem = []
    shutdown = []

    other = []

    alert_count = 0
    for alert_date in dates:
        r_s = requests.get(f"https://dashboard-api.labs.transitmatters.org/api/alerts/{alert_date}?route={line}")
        alerts = r_s.json()
        if alerts:
            for alert in alerts:
                alert_count += 1
                if "disabled train" in alert["text"]:
                    disabled_trains.append(alert)
                elif (
                    "police activity" in alert["text"]
                    or "police investigation" in alert["text"]
                    or "police action" in alert["text"]
                    or "police concluded an investigation" in alert["text"]
                ):
                    police_activity.append(alert)
                elif "medical emergency" in alert["text"]:
                    medical_emergency.append(alert)
                elif "fire" in alert["text"] or "smoke" in alert["text"]:
                    fire.append(alert)
                elif "flooding" in alert["text"]:
                    flooding.append(alert)
                elif "signal problem" in alert["text"]:
                    signal_problem.append(alert)
                elif "door problem" in alert["text"]:
                    door_problem.append(alert)
                elif (
                    "No trains between".lower() in alert["text"].lower()
                    or "Shuttle buses replace".lower() in alert["text"].lower()
                ):
                    shutdown.append(alert)
                else:
                    other.append(alert)

    print(f"Total of {alert_count} alerts between {dates[0]} and {dates[-1]} on the {line} line.")

    print(f"{round((len(disabled_trains) / alert_count)*100, 2)}% of alerts are disabled trains")
    print(f"{round((len(police_activity) / alert_count)*100, 2)}% of alerts are police activity")
    print(f"{round((len(medical_emergency) / alert_count)*100, 2)}% of alerts are medical emergencies")
    print(f"{round((len(fire) / alert_count)*100, 2)}% of alerts are fire or fire department notices")
    print(f"{round((len(flooding) / alert_count)*100, 2)}% of alerts are flooding")
    print(f"{round((len(signal_problem) / alert_count)*100, 2)}% of alerts are signal problems")
    print(f"{round((len(door_problem) / alert_count)*100, 2)}% of alerts are door problems")
    print(f"{round((len(shutdown) / alert_count)*100, 2)}% of alerts are shutdown or shuttle bus notices")
    print(f"{round((len(other) / alert_count)*100, 2)}% of alerts are other")

    print("\n")
