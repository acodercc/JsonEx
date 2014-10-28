
%%

\/\/[^\n]*                  /* skip singleline comment */
\/\*(.|\n|\r)*?\*\/         /* skip multiline comment */ 
"(?:\\[bfnrt\/"]|\\u[a-fA-F0-9]{4}|[^"\\])*"     this.yytext=this.yytext.slice(1, this.yyleng-1);return "STRING";
\s+
\r\n
((0|[1-9][0-9]*)(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?|[0][xX][0-9a-fA-F]+   return "NUMBER"
null                        return "NULL";
true                        return "TRUE";
false                       return "FALSE";
:                           return ":";
,                           return ",";
\[                          return "[";
\]                          return "]";
\{                          return "{";
\}                          return "}";
\s+                         /* skip whitespace */
\n                          /* skip lineterminal */
.                           return "INVALID";
