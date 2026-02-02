class HashMap:
    def __init__(self):
        self.map = {}

    def put(self, key):
        key = key.lower()
        if key in self.map:
            self.map[key] += 1
        else:
            self.map[key] = 1

    def put_all(self, items):
        for item in items:
            self.put(item)

    def get_map(self):
        return self.map
