import json


def split(word):
    return [char for char in word]


def check_word(string):
    matched_list = [char in tr_alpha for char in split(string)]
    is_valid = all(matched_list)
    return is_valid


file = open('kelimeler/turkce_kelime_listesi.txt', 'r')
lines = file.readlines()

words = []
tr_alpha = "abcçdefghıijklmnoöprsştuüvyz"

for line in lines:
    if len(line) == 6 and line.find(' '):
        word = line \
            .lower() \
            .replace('\n', '')

        if check_word(word):
            words.append(word)

json_file_b = open('src/words.js', 'w')
json_file_b.write(json.dumps(words))
json_file_b.close()

results = open('src/words.js', 'r')
word_list = json.loads(results.read())
print(len(word_list))
