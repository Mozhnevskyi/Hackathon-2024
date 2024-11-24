import numpy as np
import pandas as pd
from openai import OpenAI
import ast
import time
import matplotlib.pyplot as plt
from io import StringIO

client = OpenAI()

zapros = 'Get me a chart of all days in Kyiv'

g1 = pd.read_csv('city_dataset_unique.csv')
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
            "content": s1+s2+s3+s6+s7
            #"content": "Слушай внимательно, у тебя есть названия начал столбцов: 'Континенты,Страны,Города,'. Тебе нужно понять из текста:" + zapros + " какую информацию тебе нужно достать из названия начал столбцов, и вывести конкретную строчку. Например, если город Милан, то тебе надо написать: '[['Континенты','Страны','Города'], ['Европа', 'Италия','Милан']]' , строго только этот текст, без ничего лишнего. Америка будет только одно слово, БЕЗ северная и южная, пиши США. Пиши ЮАР а не Южноафриканская Республика. Вообще исполльзуй аббревиатуры. Если указана страна, то вывод должен выглядеть так: '[['Континенты','Страны'], ['Европа', 'Италия']]'. Если указан континент Европа, то вывод должен выглядеть так: '[['Континенты'], ['Европа']]'!"
        }

    ]
)

generated_code = completion.choices[0].message.content

print(generated_code)


g = pd.read_csv('city_dataset_unique.csv')
g = pd.DataFrame(g)
headers = ast.literal_eval(generated_code)

# Iterate over the list of lists
error = np.nan
for header, answer in zip(headers[0], headers[1]):

    # Check if any row contains the substring in the specified column
    if g[header].str.contains(answer, na=False, case=False).any():
        print(f"Substring '{answer}' found in column '{header}'")
        g = g[g[header] == answer]

    else:
        error = f"Error. I don't have information in my data about '{header}' - '{answer}'"
        break

if pd.isna(error):
    # Save the filtered DataFrame as a CSV
    g.to_csv('result.csv', index=False)

    # Create DataFrame
    df = pd.read_csv('result.csv')

    # Melt the DataFrame to reshape it for analysis
    df_melted = df.melt(
        id_vars=['Continents', 'Countries', 'Cities'],
        var_name='Date',
        value_name='Value'
    )

    # Convert the 'Date' column to datetime
    df_melted['Date'] = pd.to_datetime(df_melted['Date'], format='%Y.%m.%d')

    # Group by date and calculate the total sum for all cities
    total_by_date = df_melted.groupby('Date')['Value'].sum().reset_index()

    # Plot the total values by date
    plt.figure(figsize=(10, 5))
    plt.plot(total_by_date['Date'], total_by_date['Value'], marker='o')
    plt.title('Total Data from ' + headers[1][-1])
    plt.xlabel('Date')
    plt.ylabel('Total')
    plt.xticks(rotation=45)
    plt.grid()

    plt.tight_layout()
    plt.savefig('Photo.png')  # Saves the plot as a PNG file
    plt.show()

    # Close the plot to avoid saving a blank figure in case of multiple calls to plt.show()
    plt.close()

    # Optionally, show the plot on screen (this is separate from saving)
    plt.show()

else:
    print(error)