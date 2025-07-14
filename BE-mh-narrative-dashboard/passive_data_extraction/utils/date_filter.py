
import pandas as pd
from datetime import timedelta

def filter_dates(df, start_date, end_date):
    df['date'] = pd.to_datetime(df['date'])
    return df[(df['date'] >= start_date) & (df['date'] <= end_date)]


quarter_start_date = {
    1: "2018-03-26", 2: "2019-04-01",
    3: "2020-03-30", 4: "2021-03-29"}

DATE_RANGE = {}

for phase in range(1, 5):
    start_date = pd.to_datetime(quarter_start_date[phase])
    end_date = start_date + timedelta(days=69)
    DATE_RANGE[phase] = {"start": start_date, "end": end_date}
