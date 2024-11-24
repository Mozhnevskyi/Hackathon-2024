import numpy as np
import pandas as pd
from openai import OpenAI
import ast
import matplotlib.pyplot as plt

client = OpenAI()


def process_request(zapros):
    print(zapros)
    # Read the CSV file
    g1 = pd.read_csv("D:/pythonProject1/city_dataset_unique.csv")
    g1 = pd.DataFrame(g1)

    first_row_series = g1.columns
    letters_only_columns = [col for col in first_row_series if col.isalpha()]

    s1 = "Listen carefully, you have column header names: " + str(letters_only_columns) + "."
    s2 = "You need to understand from the text: " + zapros + " what information you need to extract from the column header names, and output the specific row."
    s3 = "If you see a city in " + zapros + " then the output will look like this: '[['Continents', 'Countries','Cities'], ['Continent_Name', 'Country_Name','City_Name']]'. The answer should only be the two-dimensional array, without extra text, WITHOUT ```."
    s6 = "If you see a country in " + zapros + " then the output will look like this: '[['Continents', 'Countries'], ['Continent_Name', 'Country_Name']]'"
    s7 = "If you see a continent in " + zapros + " then the output will look like this: '[['Continents'], ['Continent_Name']]', without countries and cities, NOT like [['Continents', 'Countries'], ['Europe', 'All European countries']]"
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": s1 + s2 + s3 + s6 + s7
            }
        ]
    )

    generated_code = completion.choices[0].message.content

    # Validate the generated code
    try:
        headers = ast.literal_eval(generated_code)
        if not (isinstance(headers, list) and len(headers) == 2 and all(isinstance(sublist, list) for sublist in headers)):
            raise ValueError("Invalid format for headers.")
    except Exception as e:
        print(f"Error parsing headers: {e}")
        return

    print(f"Parsed headers: {headers}")

    # Read the CSV file again for filtering
    g = pd.read_csv("D:/pythonProject1/city_dataset_unique.csv")

    # Iterate over the list of lists
    error = None
    for header, answer in zip(headers[0], headers[1]):
        if header not in g.columns:
            error = f"Error: Column '{header}' does not exist in the dataset."
            break
        if g[header].str.contains(answer, na=False, case=False).any():
            print(f"Substring '{answer}' found in column '{header}'")
            g = g[g[header].str.contains(answer, na=False, case=False)]
        else:
            error = f"Error: No matching data for '{header}' - '{answer}'."
            break

    if error:
        print(error)
        return

    # Save and analyze the filtered DataFrame
    g.to_csv('result.csv', index=False)

    # Create DataFrame for plotting
    df_melted = g.melt(
        id_vars=['Continents', 'Countries', 'Cities'],
        var_name='Date',
        value_name='Value'
    )

    df_melted['Date'] = pd.to_datetime(df_melted['Date'], format='%Y.%m.%d')
    total_by_date = df_melted.groupby('Date')['Value'].sum().reset_index()

    plt.figure(figsize=(10, 5))
    plt.plot(total_by_date['Date'], total_by_date['Value'], marker='o')
    plt.title('Total Data from ' + headers[1][-1])
    plt.xlabel('Date')
    plt.ylabel('Total')
    plt.xticks(rotation=45)
    plt.grid()
    plt.tight_layout()
    plt.savefig("D:/pythonProject1/front/react-frontend/public/graf.png")
    plt.show()
    generated_code = completion.choices[0].message.content

    res = generated_code
    return  res
