import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

dyn_resource = boto3.resource("dynamodb")


def traveltimesAggByDate(fr, to, date_start, date_end):
    table = dyn_resource.Table("TraveltimesAggByDate")
    try:
        response = table.query(
            KeyConditionExpression=Key("stations").eq(f"{fr},{to}") & Key("service_date").between(date_start, date_end)
        )
    except ClientError:
        print("could not read dynamo table TraveltimesAggByDate")
        raise
    return response["Items"]
