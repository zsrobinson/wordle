length = int(input("letters? "))

with open("google-10000-english-usa-no-swears-medium.txt", "r") as source:
	for line in source:
		stripped_line = line.strip()
		if len(stripped_line) == length:
			print(stripped_line)

			with open(str(length) + "-letter-words.txt", 'a') as dest:
				dest.write(stripped_line + "\n")