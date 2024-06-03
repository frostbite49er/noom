import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.http import JsonResponse
from django.db.models import Avg, F, Count

from .models import SleepLog, Feeling, SleepLogSerializer
from .validation import parse_and_validate_datetime, validate_feeling_field, validate_bed_time_sleep_interval


@api_view(['GET'])
def ping(request):
    return Response("pong")

class SleepLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        date = request.GET.get("date")
        parsed_date = parse_and_validate_datetime(date, "date")

        sleep_log = SleepLog.objects.filter(bed_time_end__date=parsed_date.date(), user_id=request.user.id).order_by("-id").first()
        serialized_obj = SleepLogSerializer(instance=sleep_log).data if sleep_log else None

        return JsonResponse(serialized_obj, safe=False)

    def post(self, request, *args, **kwargs):
        print(request.body)
        data = json.loads(request.body)

        bed_time_start = parse_and_validate_datetime(data["bedTimeStart"], "bedTimeStart")
        bed_time_end = parse_and_validate_datetime(data["bedTimeEnd"], "bedTimeEnd")
        feeling = validate_feeling_field(data["feeling"], "feeling")
        validate_bed_time_sleep_interval(bed_time_start, bed_time_end)

        sleep_log_item = SleepLog.objects.create(
            bed_time_start = bed_time_start,
            bed_time_end = bed_time_end,
            feeling = feeling,
            user_id = request.user.id
        )

        serialized_obj = SleepLogSerializer(instance=sleep_log_item).data
        return JsonResponse(serialized_obj, safe=False)

class SleepAvgLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        sleep_logs = SleepLog.objects.filter(user_id=request.user.id)

        if not sleep_logs.exists():
            return Response({
                "first_date": None,
                "last_date": None,
                "average_sleep_time": None,
                "count_bad": 0,
                "count_ok": 0,
                "count_good": 0
            }, status=status.HTTP_200_OK)

        first_date = sleep_logs.earliest('bed_time_start').bed_time_start
        last_date = sleep_logs.latest('bed_time_end').bed_time_end

        avg_sleep_time = sleep_logs.aggregate(avg_sleep=Avg(F('bed_time_end') - F('bed_time_start')))['avg_sleep']
        avg_sleep_time_hours = avg_sleep_time.total_seconds() / 3600 if avg_sleep_time else 0

        feeling_counts = sleep_logs.values('feeling').annotate(count=Count('feeling'))
        count_bad = next((item['count'] for item in feeling_counts if item['feeling'] == Feeling.Bad), 0)
        count_ok = next((item['count'] for item in feeling_counts if item['feeling'] == Feeling.Ok), 0)
        count_good = next((item['count'] for item in feeling_counts if item['feeling'] == Feeling.Good), 0)

        return Response({
           "first_date": first_date,
           "last_date": last_date,
           "average_sleep_time": avg_sleep_time_hours,
           "count_bad": count_bad,
           "count_ok": count_ok,
           "count_good": count_good
        }, status=status.HTTP_200_OK)
