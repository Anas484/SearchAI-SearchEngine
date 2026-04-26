import json
import uuid
from datetime import datetime

def generate_poetry_data(num_records=100):
    """
    Generate poetry data based on the Prisma model:
    model Poetry {
      id  String @id
      poetry  String
      @@index([id])
    }
    """
    
    poetry_samples = [
        "The sun sets low, painting skies of gold,\nA gentle breeze whispers stories old.",
        "In quiet woods where shadows dance,\nNature's heart beats in perfect trance.",
        "Stars ignite the velvet night,\nGuiding wanderers with their light.",
        "Rivers flow to distant seas,\nCarrying dreams on whispered breeze.",
        "Mountains stand in silent grace,\nWatching time's eternal race.",
        "Flowers bloom in spring's embrace,\nPainting earth with vibrant lace.",
        "Moonlight spills on silver streams,\nFulfilling nature's waking dreams.",
        "Autumn leaves in golden flight,\nDance away from summer's light.",
        "Winter's breath on frosted pane,\nWrites stories of falling rain.",
        "Spring awakens sleeping earth,\nWith songs of rebirth and mirth.",
        "Ocean waves in rhythmic sway,\nTell tales of night and endless day.",
        "Desert winds across the sand,\nCarry secrets from ancient land.",
        "Forest deep in emerald green,\nHolds magic yet unseen.",
        "Morning dew on spider's web,\nCatches light from dawn's first tread.",
        "Evening stars begin to gleam,\nFulfilling nature's waking dream.",
        "Thunder rolls across the sky,\nAs storm clouds gather, passing by.",
        "Rainbow arches after rain,\nA promise bright, a hope again.",
        "Misty morning on the lake,\nStill waters for nature's sake.",
        "Golden fields of wheat and corn,\nAwait autumn's peaceful morn."
    ]
    
    poetry_data = []
    
    for i in range(num_records):
        # Generate unique ID
        poetry_id = str(uuid.uuid4())
        
        # Select poetry (cycle through samples or create variations)
        base_poetry = poetry_samples[i % len(poetry_samples)]
        
        # Use the base poetry directly
        poetry_text = base_poetry
        
        poetry_record = {
            "id": poetry_id,
            "poetry": poetry_text
        }
        
        poetry_data.append(poetry_record)
    
    return poetry_data

def save_poetry_to_json(poetry_data, filename="poetry_data.json"):
    """Save poetry data to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(poetry_data, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(poetry_data)} poetry records to {filename}")

def save_poetry_to_csv(poetry_data, filename="poetry_data.csv"):
    """Save poetry data to CSV file"""
    import csv
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['id', 'poetry'])
        writer.writeheader()
        writer.writerows(poetry_data)
    print(f"Saved {len(poetry_data)} poetry records to {filename}")

def generate_poetry_insert_sql(poetry_data, filename="poetry_insert.sql"):
    """Generate SQL insert statements for the poetry data"""
    sql_statements = []
    sql_statements.append("-- Insert statements for Poetry table")
    sql_statements.append("-- Generated on: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    sql_statements.append("")
    
    for record in poetry_data:
        # Escape single quotes in poetry text
        escaped_poetry = record['poetry'].replace("'", "''")
        sql = f"INSERT INTO Poetry (id, poetry) VALUES ('{record['id']}', '{escaped_poetry}');"
        sql_statements.append(sql)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    print(f"Generated SQL insert statements in {filename}")

if __name__ == "__main__":
    # Generate poetry data
    print("Generating poetry data...")
    poetry_data = generate_poetry_data(500)  # Generate 50 records
    
    # Save in different formats
    # save_poetry_to_json(poetry_data)
    save_poetry_to_csv(poetry_data)
    # generate_poetry_insert_sql(poetry_data)
    
    print("\nSample poetry record:")
    print(json.dumps(poetry_data[0], indent=2))
    
    print(f"\nGenerated {len(poetry_data)} poetry records successfully!")
