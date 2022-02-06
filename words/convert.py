import json
sources = ["guessDictionary", "winDictionary"]

for source in sources:
	with open(source + ".txt", "r") as file:
		data = []

		for line in file:
			stripped_line = line.strip()
			data.append(stripped_line)

		with open(source + ".json", 'w') as dest:
			dest.write(json.dumps(data))
			
		print(f"Added {str(len(data))} words to {source}.")