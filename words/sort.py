import json

length = int(input("letters? "))
data = []

with open("google-10000-english-usa-no-swears-medium.txt", "r") as source:
	for line in source:
		stripped_line = line.strip()
		if len(stripped_line) == length:
			print(stripped_line)
			data.append(stripped_line)

with open(str(length) + "-letter-words.json", 'w') as dest:
	dest.write(json.dumps(data))