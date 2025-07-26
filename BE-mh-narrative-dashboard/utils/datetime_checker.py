
from datetime import datetime
import re


def datetime_checker(date: str):
    try:
        datetime.strptime(date, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def strip_date(date):
    match = re.search(r'\d{4}-\d{2}-\d{2}', date)
    if not match:
        return None
    return datetime.strptime(match.group(), '%Y-%m-%d')


def date_between(date, start_date, end_date):
    date = strip_date(date)
    start_date = strip_date(start_date)
    end_date = strip_date(end_date)
    if not date or not start_date or not end_date:
        return False
    return start_date <= date <= end_date

def date_before(date, end_date):
    date = strip_date(date)
    end_date = strip_date(end_date)
    if not date or not end_date:
        return False
    return date <= end_date