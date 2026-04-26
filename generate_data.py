import uuid
import random
from datetime import datetime, timedelta

ITEMS = [
    "Furosemide", "Plavix", "Aspirin", "Metformin",
    "Atorvastatin", "Ibuprofen", "Amoxicillin"
]

def random_date():
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2025, 12, 31)
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    date = start_date + timedelta(days=random_days)
    return date.strftime("%Y-%m-%d")

def generate_order():
    return {
        "order_id": str(uuid.uuid4()).upper(),
        "user_id": str(uuid.uuid4()).upper(),
        "items": ", ".join(random.sample(ITEMS, random.randint(1, 5))),
        "total_price": round(random.uniform(1, 100), 2),
        "date": random_date()
    }

def generate_orders(n=10):
    return [generate_order() for _ in range(n)]


def create_csv(rows = 100):
    orders = generate_orders(rows)
    with open("orders.csv", "w") as f:
        f.write("order_id,user_id,items,total_price,date\n")
        for order in orders:
            f.write(f"{order['order_id']},{order['user_id']},{order['items']},{order['total_price']},{order['date']}\n")

if __name__ == "__main__":
    create_csv(1000)