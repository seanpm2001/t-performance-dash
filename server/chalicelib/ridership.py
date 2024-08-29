from datetime import date
from typing import List, TypedDict

from .dynamo import query_ridership


class RidershipEntry(TypedDict):
    date: str
    count: int


def get_ridership(
    line_id: str,
    start_date: date,
    end_date: date,
) -> List[RidershipEntry]:
    query_results = query_ridership(
        start_date=start_date,
        end_date=end_date,
        line_id=line_id,
    )
    results = []
    for result in query_results:
        results.append({"date": result["date"], "count": result["count"]})
    return results


def get_historical_max(line_id: str) -> int:
    earliest_date = date(2018, 1, 1)
    one_year_ago = date.today().replace(year=date.today().year - 1)
    ridership = get_ridership(line_id, earliest_date, one_year_ago)
    max_ridership = 0
    for entry in ridership:
        if entry["count"] > max_ridership:
            max_ridership = entry["count"]
    return max_ridership
