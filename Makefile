CC = emcc
CFLAGS = -Wall -Wextra -g -fshort-enums
LFLAGS = -L . -lchesscat
FILENAME = webdemo.js

main: main.c
	$(CC) $(CFLAGS) main.c $(LFLAGS) -o $(FILENAME)

.PHONY: clean

clean:
	rm -f $(FILENAME)
