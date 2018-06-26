with open("all1v1sets.txt") as data:
    file = data.read()
with open("all1v1sets.txt", 'w') as container:
    container.write("%r"%file)