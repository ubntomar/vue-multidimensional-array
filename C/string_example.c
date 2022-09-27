/***
 *Strings are actually one-dimensional array of characters terminated by a null character '\0'. Thus a null-terminated string contains the characters that comprise the string followed by a null
**/

#include <stdio.h>

int main () {

   char greeting[6] = {'H', 'e', 'l', 'l', 'o', '\n'};
   printf("Greeting message::: %s\n", greeting );
   return 0;
}
